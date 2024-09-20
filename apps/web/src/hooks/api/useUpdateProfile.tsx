'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UpdateProfilePayload {
  imageUrl: File | string | null;
  name: string;
  email: string;
}

const useUpdateProfile = (id: number) => {
  const router = useRouter();
  const { axiosInstance } = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const editProfileForm = new FormData();

      editProfileForm.append('imageUrl', payload.imageUrl!);
      editProfileForm.append('name', payload.name);
      editProfileForm.append('email', payload.email);
      const { data } = await axiosInstance.patch(
        `/user/${id}`,
        editProfileForm,
      );
      return data;
    },
    onSuccess: async (data) => {
      await signIn('credentials', { ...data, redirect: false });
      toast.success('Update Profile Success');
      if (data.roles !== 'TENANT') {
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

export default useUpdateProfile;
