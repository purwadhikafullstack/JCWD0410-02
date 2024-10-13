'use client';

import useAxios from '@/hooks/useAxios';
import { PageableResponse, PaginationQueries } from '@/types/pagination';
import { Room } from '@/types/room';
import { useQuery } from '@tanstack/react-query';

interface GetRoomsQueries extends PaginationQueries {
  propertyId?: number;
  search?: string;
}

export const useGetRoomsTenant = (queries: GetRoomsQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['room', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Room>>(
        '/room/tenant',
        {
          params: queries,
        },
      );
      return data;
    },
  });
};
