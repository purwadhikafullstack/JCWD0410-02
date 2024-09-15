'use client';

import useAxios from '@/hooks/useAxios';
import { Role } from '@/types/user';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface RegisterPayload {
  name: string;
  email: string;
  role: Role;
}

const useRegister = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await axiosInstance.post('/auth/register', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Register success');
      router.push('/register/thanks');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useRegister;
