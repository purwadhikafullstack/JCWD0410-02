'use client';

import useAxios from '@/hooks/useAxios';
import { PageableResponse, PaginationQueries } from '@/types/pagination';
import { Property } from '@/types/property';
import { useQuery } from '@tanstack/react-query';

interface GetPropertyQueries extends PaginationQueries {
  search?: string;
}

export const useGetProperty = (queries: GetPropertyQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['property', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Property>>(
        '/property',
        {
          params: queries,
        },
      );
      return data;
    },
  });
};
