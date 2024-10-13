'use client';

import useAxios from '@/hooks/useAxios';
import { Tenant } from '@/types/tenant';
import { useQuery } from '@tanstack/react-query';

const useGetTenant = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['tenant'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Tenant>(`/auth/tenant/`);
      return data;
    },
  });
};

export default useGetTenant;
