import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

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
  };
  peakSeasonPrices: { date: string; price: number }[];
  remainingStock: number;
}

const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<TransactionResponse, Error, CreateBookingPayload>({
    mutationFn: async (bookingPayload: CreateBookingPayload) => {
      const { data } = await axiosInstance.post<TransactionResponse>(
        `/usertransactions/${bookingPayload.roomId}/create`,
        {
          startDate: bookingPayload.startDate,
          endDate: bookingPayload.endDate,
          paymentMethode: bookingPayload.paymentMethode, 
        }
      );
      return data;
    },
    onSuccess: (data) => {
      const { transaction, peakSeasonPrices, remainingStock } = data;
      toast.success(`Booking successful! Transaction ID: ${transaction.id}`);
      
      if (peakSeasonPrices.length > 0) {
        toast.info(`Peak season prices applied on: ${peakSeasonPrices.map(ps => `${ps.date}: ${ps.price}`).join(', ')}`);
      }
      
      toast.info(`Remaining stock: ${remainingStock}`);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Booking failed');
    },
  });
};

export default useCreateBooking;
