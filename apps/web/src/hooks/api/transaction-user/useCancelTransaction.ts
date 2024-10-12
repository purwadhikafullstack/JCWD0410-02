import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface CancelTransactionPayload {
  transactionId: number;
}

const useCancelTransaction = () => {
  return useMutation({
    mutationFn: async ({ transactionId }: CancelTransactionPayload) => {
      const { data } = await axiosInstance.patch(`/usertransactions/${transactionId}/cancel`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Transaction cancelled successfully');
    },
    onError: () => {
      toast.error('Failed to cancel transaction');
    },
  });
};

export default useCancelTransaction;
