'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface ChangeEmailPayload {
  email: string;
}

const useChangeEmail = () => {
  const { axiosInstance } = useAxios();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ChangeEmailPayload) => {
      const { data } = await axiosInstance.patch('/auth/change-email', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Send email success');
      router.push('/login');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};
export default useChangeEmail;
