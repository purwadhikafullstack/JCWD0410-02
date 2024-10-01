import useAxios from '@/hooks/useAxios';
import { PageableResponse, PaginationQueries } from '@/types/pagination';
import { PropertyCategory } from '@/types/propertyCategory';
import { useQuery } from '@tanstack/react-query';

interface GetCategoryListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

const useGetCategory = (queries: GetCategoryListQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['categorylist', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<PropertyCategory>
      >('/category', { params: queries });
      return data;
    },
  });
};

export default useGetCategory;
