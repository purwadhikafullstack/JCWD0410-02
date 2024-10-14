'use client';
import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/DatePickerRange';
import { useRouter } from 'next/navigation';
import useGetRoomDetails from '@/hooks/api/transaction-user/useGetRoomDetails';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCreateBooking from '@/hooks/api/transaction-user/useCreateBooking';
import { toast } from 'react-toastify';
import useProcessOrder from '@/hooks/api/status/useCreateConfirm';
import useCancelOrder from '@/hooks/api/status/useCreateCanceled';
interface ReservationFormProps {
  roomId: number;
  price: number;
  transactionId?: number;
}

const ReservationForm: FC<ReservationFormProps> = ({ roomId, price }) => {
  const [selectedDates, setSelectedDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [peakSeasonDetails, setPeakSeasonDetails] = useState<
    { date: string; price: number }[] | null
  >(null);
  const [paymentMethode, setPaymentMethode] = useState<
    'MANUAL' | 'OTOMATIS' | undefined
  >(undefined);

  const { mutateAsync: createBooking, isSuccess, data } = useCreateBooking();
  const { mutate: processOrder } = useProcessOrder(); 
  const { mutate: cancelOrder } = useCancelOrder(); 

  const router = useRouter();

  const { data: roomDetails, isLoading } = useGetRoomDetails(
    selectedDates
      ? {
          roomId,
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
        }
      : undefined,
  );

  useEffect(() => {
    if (
      selectedDates &&
      roomDetails &&
      selectedDates.startDate &&
      selectedDates.endDate
    ) {
      const peakSeasonPrices = roomDetails.peakSeasonPrices || [];
      const peakSeasonTotal = peakSeasonPrices.reduce(
        (acc: number, p: { price: number }) => acc + p.price,
        0,
      );

      const startDate = new Date(selectedDates.startDate);
      const endDate = new Date(selectedDates.endDate);
      const totalNights =
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      let numberOfNights = totalNights >= 1 ? totalNights : 1;
      const regularPriceDays = numberOfNights - peakSeasonPrices.length;
      const total = peakSeasonTotal + regularPriceDays * price;
      setTotalPrice(total);
      setPeakSeasonDetails(peakSeasonPrices);
    } else {
      setTotalPrice(null);
    }
  }, [roomDetails, selectedDates, price]);

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY!;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    scriptTag.async = true;
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleDateChange = (
    dates: { startDate: string; endDate: string } | null,
  ) => {
    setSelectedDates(dates);
  };

  const handleBooking = async () => {
    try {
      if (
        selectedDates &&
        selectedDates.startDate &&
        selectedDates.endDate &&
        paymentMethode
      ) {
        const transaction = await createBooking({
          roomId,
          startDate: selectedDates.startDate,
          endDate: selectedDates.endDate,
          paymentMethode,
        });
        if (transaction.transaction.snapToken) {
          window.snap.pay(transaction.transaction.snapToken, {
            onSuccess: function (result: any) {
              toast.success('Payment success!');
              processOrder({ transactionId: transaction.transaction.id });
            },
            onPending: function (result: any) {
              toast.info('Payment pending.');
            },
            onError: function (result: any) {
              toast.error('Payment failed.');
              cancelOrder({ transactionId: transaction.transaction.id });
            },
            onClose: function () {
              toast.info('Payment popup closed.');
            },
          });
        }
      }
    } catch (error) {
      throw error;
    }
  };
  

  useEffect(() => {
    if (isSuccess && data && paymentMethode === 'MANUAL') {
      router.push(`/upload-proof/${data.transaction.id}`);
    }
  }, [isSuccess, data, router, paymentMethode]);

  return (
    <div>
      <DatePickerWithRange onChange={handleDateChange} />
      {totalPrice !== null && (
        <p className="text-center mt-2 font-semibold">
          Total:{' '}
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(totalPrice)}
        </p>
      )}
      {selectedDates && !isLoading && roomDetails && (
        <div className="mt-4 text-center">
          {roomDetails.isAvailable ? (
            <p className="text-green-600 font-semibold">Room is available</p>
          ) : (
            <p className="text-red-600 font-semibold">Room is not available</p>
          )}
        </div>
      )}
      {peakSeasonDetails && peakSeasonDetails.length > 0 && (
        <div>
          <p>Peak Season Prices:</p>
          <ul>
            {peakSeasonDetails.map((detail) => (
              <li key={detail.date}>
                {detail.date}:{' '}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(detail.price)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <p className="font-semibold">Pilih Metode Pembayaran:</p>
        <Select
          onValueChange={(value) =>
            setPaymentMethode(value as 'MANUAL' | 'OTOMATIS')
          }
          value={paymentMethode}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Metode Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MANUAL">Manual</SelectItem>
            <SelectItem value="OTOMATIS">Otomatis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full mt-3"
        onClick={handleBooking}
        disabled={!selectedDates || !selectedDates.endDate || !paymentMethode}
      >
        Choose
      </Button>
    </div>
  );
};
export default ReservationForm;
