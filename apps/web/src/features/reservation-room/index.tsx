'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/DatePickerRange';
import useCreateBooking from '@/hooks/api/transaction-user/useCreateBooking';
import { useRouter } from 'next/navigation';
import useGetRoomDetails from '@/hooks/api/transaction-user/useGetRoomDetails';

interface ReservationFormProps {
  roomId: number;
  price: number;
  transactionId?: number;  
}

const ReservationForm: FC<ReservationFormProps> = ({ roomId, price }) => {
  const [selectedDates, setSelectedDates] = useState<{ startDate: string; endDate: string } | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [peakSeasonDetails, setPeakSeasonDetails] = useState<{ date: string; price: number }[] | null>(null);
  const [remainingStock, setRemainingStock] = useState<number | null>(null);

  const { mutate: createBooking, isSuccess, data } = useCreateBooking();
  const router = useRouter();

  const { data: roomDetails } = useGetRoomDetails(
    selectedDates
      ? {
          roomId,
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
        }
      : undefined
  );

  useEffect(() => {
    console.log('Room Details:', roomDetails); 
    console.log('Selected Dates:', selectedDates);

    if (selectedDates && roomDetails && selectedDates.startDate && selectedDates.endDate) {
      const peakSeasonPrices = roomDetails.peakSeasonPrices || [];
      const peakSeasonTotal = peakSeasonPrices.reduce((acc: number, p: { price: number }) => acc + p.price, 0);

      const startDate = new Date(selectedDates.startDate);
      const endDate = new Date(selectedDates.endDate);
      const totalNights = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

      let numberOfNights = totalNights >= 1 ? totalNights : 1;

      const regularPriceDays = numberOfNights - peakSeasonPrices.length;

      const total = peakSeasonTotal + regularPriceDays * price;

      console.log('Total Nights:', numberOfNights); 
      console.log('Total Price:', total); 

      setTotalPrice(total);
      setPeakSeasonDetails(peakSeasonPrices);
      setRemainingStock(roomDetails.remainingStock);
    } else {
      setTotalPrice(null);
    }
  }, [roomDetails, selectedDates, price]);

  const handleDateChange = (dates: { startDate: string; endDate: string } | null) => {
    console.log('Date Range Changed:', dates); // Debugging log saat range tanggal berubah
    setSelectedDates(dates);
  };

  const handleBooking = () => {
    if (selectedDates && selectedDates.startDate && selectedDates.endDate) {
      createBooking({
        roomId,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
      });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      router.push(`/upload-proof/${data.transaction.id}`);
    }
  }, [isSuccess, data, router]);

  return (
    <div>
      <DatePickerWithRange onChange={handleDateChange} />
      {totalPrice !== null && (
        <p className="text-center mt-2 font-semibold">
          Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}
        </p>
      )}
      {peakSeasonDetails && peakSeasonDetails.length > 0 && (
        <div>
          <p>Peak Season Prices:</p>
          <ul>
            {peakSeasonDetails.map((detail) => (
              <li key={detail.date}>
                {detail.date}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(detail.price)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {remainingStock !== null && (
        <p className="text-center mt-2">Remaining Stock: {remainingStock}</p>
      )}
      <Button
        className="w-full mt-3"
        onClick={handleBooking}
        disabled={!selectedDates || !selectedDates.endDate} // Disabled if startDate or endDate is not selected
      >
        Choose
      </Button>
    </div>
  );
};

export default ReservationForm;
