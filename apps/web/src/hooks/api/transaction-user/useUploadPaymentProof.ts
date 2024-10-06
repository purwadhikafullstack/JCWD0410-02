import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-toastify';

interface UploadPaymentProofPayload {
  transactionId: number;
  file: File;
}

const useUploadPaymentProof = () => {
  return useMutation({
    mutationFn: async ({ transactionId, file }: UploadPaymentProofPayload) => {
      const formData = new FormData();
      formData.append('paymentProof', file);

      const { data } = await axiosInstance.post(
        `/usertransactions/${transactionId}/upload-proof`, // Perbaiki URL
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Payment proof uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload payment proof');
    },
  });
};

export default useUploadPaymentProof;
