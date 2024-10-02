import { useQuery } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios';
import { SalesReport } from '@/types/report';

interface GetSalesReportQuery {
  propertyTitle?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

const useGetSalesReport = (queries: GetSalesReportQuery) => {
  const { axiosInstance } = useAxios();

  return useQuery<SalesReport[], Error>({
    queryKey: ['salesReport', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<SalesReport[]>('/reportanalysis', {
        params: queries,
      });
      return data;
    },
  });
};

export default useGetSalesReport;
