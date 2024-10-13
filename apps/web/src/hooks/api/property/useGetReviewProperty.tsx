import { useQuery } from '@tanstack/react-query';
import { Review } from '@/types/review'; 
import { IPageableResponse } from '@/types/pagination';
import useAxios from '@/hooks/useAxios';

interface GetPropertyReviewsQuery {
  propertyId: number; 
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const useGetPropertyReviews = (queries: GetPropertyReviewsQuery) => {
  const { axiosInstance } = useAxios();

  return useQuery<IPageableResponse<Review>, Error>({
    queryKey: ['propertyReviews', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPageableResponse<Review>>(`/usertransactions/${queries.propertyId}/reviews`, {
        params: {
          page: queries.page || 1,
          take: queries.take || 10,
          sortBy: queries.sortBy || 'createdAt',
          sortOrder: queries.sortOrder || 'desc',
        },
      });

      return data; // Ini akan mengembalikan data yang memiliki `reviewId` (id dari review)
    },
  });
};

export default useGetPropertyReviews;
