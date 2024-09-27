import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

interface CancelOrderInput {
  transactionId: number;
}

const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }: CancelOrderInput) => {
      // Mengirimkan permintaan ke endpoint backend untuk membatalkan pesanan
      const { data } = await axiosInstance.post(`/tenanttransactions/${transactionId}/cancel`);
      return data;
    },
    onSuccess: (data) => {
      console.log('Order cancelled successfully:', data);
      // Invalidasi cache query agar data transaksi diperbarui
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error cancelling order:', error);
    },
  });
};

export default useCancelOrder;
