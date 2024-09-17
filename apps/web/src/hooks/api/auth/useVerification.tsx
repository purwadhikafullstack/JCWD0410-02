'use client';

import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface VerificationPayload {
  password: string;
  confirmPassword: string;
}

const useVerification = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VerificationPayload) => {
      const { data } = await axiosInstance.patch(
        '/auth/verification',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Verification success');
      router.replace('/login');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useVerification;
