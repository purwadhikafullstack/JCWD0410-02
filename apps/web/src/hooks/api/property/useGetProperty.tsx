'use client';

import useAxios from '@/hooks/useAxios';
import { Property } from '@/types/property';
import { PropertyCategory } from '@/types/propertyCategory';
import { PropertyFacility } from '@/types/propertyFacility';
import { PropertyImage } from '@/types/propertyImage';
import { Review } from '@/types/review';
import { Room } from '@/types/room';
import { Tenant } from '@/types/tenant';
import { useQuery } from '@tanstack/react-query';

const useGetProperty = (slug: string) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Property>(`/property/${slug}`);
      return data;
    },
  });
};

export default useGetProperty;
