import { useQuery } from '@tanstack/react-query';
import { PropertyReport } from '@/types/propertyreport';
import useAxios from '@/hooks/useAxios';

interface GetPropertyReportQuery {
  startDate?: string;
  endDate?: string;
}

const useGetPropertyReport = (queries: GetPropertyReportQuery) => {
  const { axiosInstance } = useAxios();
  return useQuery<PropertyReport[], Error>({
    queryKey: ['propertyReport', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PropertyReport[]>('/reportanalysis/propertyreport', {
        params: queries,
      });
      return data;
    },
  });
};

export default useGetPropertyReport;
