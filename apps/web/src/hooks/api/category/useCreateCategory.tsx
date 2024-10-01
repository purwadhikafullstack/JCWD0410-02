'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CreateCategoryPayload {
  name: string;
}

const useCreateCategory = (propertyCategoryId: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const { data } = await axiosInstance.post(
        `/category/${propertyCategoryId}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success('Create Category success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreateCategory;
