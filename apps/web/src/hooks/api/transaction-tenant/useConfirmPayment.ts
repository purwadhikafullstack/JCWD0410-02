import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface ConfirmPaymentInput {
  transactionId: number;
  confirm: boolean;  
}

const useConfirmPayment = () => {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async ({ transactionId, confirm }: ConfirmPaymentInput) => {
      const { data } = await axiosInstance.post(`/tenanttransactions/${transactionId}/confirm`, {
        confirm,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Payment status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Error updating payment status');
    },
  });
};

export default useConfirmPayment;
