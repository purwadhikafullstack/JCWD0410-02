import { useQuery } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios';

interface GetRoomDetailsQuery {
  roomId: number;
  startDate: string;
  endDate: string;
}

const useGetRoomDetails = (query: GetRoomDetailsQuery | undefined) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['roomDetails', query],
    queryFn: async () => {
      if (!query) return null;

      const { data } = await axiosInstance.get(`/usertransactions/${query.roomId}/room-details`, {
        params: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
      });
      return data;
    },
    enabled: !!query, 
  });
};

export default useGetRoomDetails;
