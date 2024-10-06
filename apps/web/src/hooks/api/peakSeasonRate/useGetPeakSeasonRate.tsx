import useAxios from '@/hooks/useAxios';
import { PageableResponse, PaginationQueries } from '@/types/pagination';
import { PeakSeasonRate } from '@/types/peakSeasonRate';
import { useQuery } from '@tanstack/react-query';

interface GetPeakSeasonsListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

const useGetPeakSeasons = (queries: GetPeakSeasonsListQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['peakSeasonRate', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<PeakSeasonRate>
      >('/peakSeasonRate', { params: queries });
      return data;
    },
  });
};

export default useGetPeakSeasons;
