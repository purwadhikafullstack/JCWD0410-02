import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';


interface ConfirmPaymentInput {
  transactionId: number;
  confirm: boolean;  // true for confirm, false for reject
}


const useConfirmPayment = () => {
  const queryClient = useQueryClient(); // Menggunakan queryClient untuk invalidasi query

  return useMutation({
    mutationFn: async ({ transactionId, confirm }: ConfirmPaymentInput) => {
      const { data } = await axiosInstance.post(`/tenanttransactions/${transactionId}/confirm`, {
        confirm,
      });
      return data;
    },
    onSuccess: (data) => {
      console.log('Payment status updated successfully:', data);

      queryClient.invalidateQueries({ queryKey: ['transactions'] }); // Menggunakan object untuk invalidate query
    },
    onError: (error) => {
      console.error('Error updating payment status:', error);
    },
  });
};

export default useConfirmPayment;
