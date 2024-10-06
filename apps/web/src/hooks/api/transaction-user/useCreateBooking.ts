import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface CreateBookingPayload {
  roomId: number;
  startDate: string; // Format: "YYYY-MM-DD"
  endDate: string;   // Format: "YYYY-MM-DD"
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
        `/usertransactions/${bookingPayload.roomId}/create`, // Cocokkan dengan route backend
        {
          startDate: bookingPayload.startDate,
          endDate: bookingPayload.endDate,
        }
      );
      return data; // Mengembalikan data yang mencakup transaction ID
    },
    onSuccess: (data) => {
      const { transaction, peakSeasonPrices, remainingStock } = data;
      toast.success(`Booking successful! Transaction ID: ${transaction.id}`);
      
      // Log any peak season price information
      if (peakSeasonPrices.length > 0) {
        toast.info(`Peak season prices applied on: ${peakSeasonPrices.map(ps => `${ps.date}: ${ps.price}`).join(', ')}`);
      }
      
      // Log remaining stock
      toast.info(`Remaining stock: ${remainingStock}`);
      
      queryClient.invalidateQueries({ queryKey: ['transactions'] }); // Refresh data transaksi
    },
    onError: () => {
      toast.error('Booking failed');
    },
  });
};

export default useCreateBooking;
