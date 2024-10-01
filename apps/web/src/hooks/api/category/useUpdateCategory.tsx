'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UpdateCategoryPayload {
  id: number;
  name: string;
}

const useUpdateCategory = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateCategoryPayload) => {
      const { data } = await axiosInstance.patch(
        `/category/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success('Update Category success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdateCategory;
