import useAxios from '@/hooks/useAxios';
import { PageableResponse, PaginationQueries } from '@/types/pagination';
import { PropertyCategory } from '@/types/propertyCategory';
import { useQuery } from '@tanstack/react-query';

const useGetAllCategoryList = () => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ['categorylist'],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<PageableResponse<PropertyCategory>>(
          '/category/list',
        );
      return data;
    },
  });
};

export default useGetAllCategoryList;
