import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface CancelOrderInput {
  transactionId: number;
}

const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }: CancelOrderInput) => {
      const { data } = await axiosInstance.post(`/status/${transactionId}/cancel`);
      return data;
    },
    onSuccess: () => {
      toast.success('Transaction cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Error cancelling transaction');
    },
  });
};

export default useCancelOrder;
