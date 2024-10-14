import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface ProcessOrderInput {
  transactionId: number;
}

const useProcessOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId }: ProcessOrderInput) => {
      const { data } = await axiosInstance.post(`/status/${transactionId}/process`);
      return data;
    },
    onSuccess: () => {
      toast.success('Transaction processed successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast.error('Error processing transaction');
    },
  });
};

export default useProcessOrder;
