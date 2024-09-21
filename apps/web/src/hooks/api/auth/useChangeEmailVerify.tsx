'use client';

import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const useChangeEmailVerify = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.patch('/auth/verify-email', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Change email success');
      router.replace('/login');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useChangeEmailVerify;
