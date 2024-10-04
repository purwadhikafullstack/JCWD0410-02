'use client';

import useAxios from '@/hooks/useAxios';
import { Property } from '@/types/property';
import { useQuery } from '@tanstack/react-query';

const useGetPropertyTenant = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Property>(
        `/property/management/${id}`,
      );
      return data;
    },
  });
};

export default useGetPropertyTenant;
