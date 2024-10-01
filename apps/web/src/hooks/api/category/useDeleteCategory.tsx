'use client';

import useAxios from '@/hooks/useAxios';
import { PropertyCategory } from '@/types/propertyCategory';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const useDeleteCategory = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/category/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success('Delete Category success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useDeleteCategory;
