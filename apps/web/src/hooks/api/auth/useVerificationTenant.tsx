'use client';

import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface VerificationTenantPayload {
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  bankName: string;
  bankNumber: number;
}

const useVerificationTenant = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: VerificationTenantPayload) => {
      const { data } = await axiosInstance.patch(
        '/auth/verification-tenant',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Verification success');
      router.replace('/login');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useVerificationTenant;
