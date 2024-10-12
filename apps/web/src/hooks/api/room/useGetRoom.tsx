'use client';

import useAxios from '@/hooks/useAxios';
import { Room } from '@/types/room';
import { useQuery } from '@tanstack/react-query';

const useGetRoom = (id: number) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Room>(`/room/${id}`);
      return data;
    },
  });
};

export default useGetRoom;
