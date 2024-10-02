import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PropertyReport } from '@/types/propertyreport';

interface GetPropertyReportQuery {
  startDate?: string;
  endDate?: string;
}
const useGetPropertyReport = (queries: GetPropertyReportQuery) => {
  return useQuery<PropertyReport[], Error>({
    queryKey: ['propertyReport', queries],
    queryFn: async () => {
      const { data } = await axios.get<PropertyReport[]>('/api/reportanalysis/propertyreport', {
        params: queries,
      });
      return data;
    },
  });
};

export default useGetPropertyReport;
