'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post('/auth/login', payload);
      return data;
    },
    onSuccess: async (data) => {
      await signIn('credentials', { ...data, redirect: false });
      toast.success('Login Success');

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

export default useLogin;
