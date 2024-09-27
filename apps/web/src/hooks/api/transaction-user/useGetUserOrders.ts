import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { IPageableResponse } from '@/types/pagination';
import useAxios from '@/hooks/useAxios';

interface GetUserTransactionsQuery {
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string; // Filter by search term
  uuid?: string;   // Filter by UUID (order number)
  dateFrom?: string; // Start date filter
  dateTo?: string;   // End date filter
}

const useGetUserTransactions = (queries: GetUserTransactionsQuery) => {
  const { axiosInstance } = useAxios(); // Hook to get axios instance with token
  return useQuery<IPageableResponse<Transaction>, Error>({
    queryKey: ['userTransactions', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPageableResponse<Transaction>>(
        '/usertransactions',
        {
          params: queries, // Passing queries like page, take, uuid, date filters, etc.
        }
      );
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });
};

export default useGetUserTransactions;
