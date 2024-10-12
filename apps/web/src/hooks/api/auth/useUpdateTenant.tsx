'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UpdateTenantPayload {
  imageUrl: File | string | null;
  name: string;
  phone: number;
  bankName: string;
  bankNumber: number;
}

const useUpdateTenant = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTenantPayload) => {
      const editProfileForm = new FormData();

      editProfileForm.append('imageUrl', payload.imageUrl!);
      editProfileForm.append('name', payload.name);
      editProfileForm.append('phone', String(payload.phone));
      editProfileForm.append('bankName', payload.bankName);
      editProfileForm.append('bankNumber', String(payload.bankNumber));
      const { data } = await axiosInstance.patch(
        `/auth/tenant/${id}`,
        editProfileForm,
      );
      return data;
    },
    onSuccess: async (data) => {
      if (data.email || data.password) {
        await signIn('credentials', { ...data, redirect: false });
      }
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
      toast.success('Update Profile Success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdateTenant;
