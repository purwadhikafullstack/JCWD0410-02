'use client';

import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}

const useResetPassword = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const { data } = await axiosInstance.patch(
        '/auth/reset-password',
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
      toast.success('Reset password success');
      router.replace('/login');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useResetPassword;
