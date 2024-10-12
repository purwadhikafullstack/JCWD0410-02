'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface ChangePasswordPayload {
  password: string;
  confirmPassword: string;
}

const useChangePassword = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const { data } = await axiosInstance.patch(
        `/auth/change-password/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success('Change password success');
      if (data.role !== 'TENANT') {
        router.push('/');
      } else {
        return router.push('/dashboard');
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useChangePassword;
