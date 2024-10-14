import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAxios from '@/hooks/useAxios';
interface CreateBookingPayload {
  roomId: number;
  startDate: string;
  endDate: string;
  paymentMethode: 'MANUAL' | 'OTOMATIS';
}

interface TransactionResponse {
  transaction: {
    id: number;
    status: string;
    total: number;
    startDate: string;
    endDate: string;
    snapToken?: string; 
  };
  peakSeasonPrices: { date: string; price: number }[];
  remainingStock: number;
}

const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation<TransactionResponse, Error, CreateBookingPayload>({
    mutationFn: async (bookingPayload: CreateBookingPayload) => {
      const { data } = await axiosInstance.post<TransactionResponse>(
        `/usertransactions/${bookingPayload.roomId}/create`,
        {
          startDate: bookingPayload.startDate,
          endDate: bookingPayload.endDate,
          paymentMethode: bookingPayload.paymentMethode,
        },
      );
      return data;
    },
    onSuccess: (data) => {
      const { transaction, peakSeasonPrices, remainingStock } = data;
      toast.success(`Booking successful! Transaction ID: ${transaction.id}`);

      if (peakSeasonPrices.length > 0) {
        toast.info(
          `Peak season prices applied on: ${peakSeasonPrices.map((ps) => `${ps.date}: ${ps.price}`).join(', ')}`,
        );
      }

      toast.info(`Remaining stock: ${remainingStock}`);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (err) => {
      console.log(err);
      toast.error('Booking failed');
    },
  });
};

export default useCreateBooking;
