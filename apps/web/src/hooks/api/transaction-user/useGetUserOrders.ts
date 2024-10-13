import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { IPageableResponse } from '@/types/pagination';
import useAxios from '@/hooks/useAxios';

interface GetUserTransactionsQuery {
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string; 
  uuid?: string;   
  dateFrom?: string; 
  dateTo?: string;   
}

const useGetUserTransactions = (queries: GetUserTransactionsQuery) => {
  const { axiosInstance } = useAxios(); 

  return useQuery<IPageableResponse<Transaction>, Error>({
    queryKey: ['userTransactions', queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPageableResponse<Transaction>>(
        '/usertransactions', 
        {
          params: queries, 
        }
      );
      return data;
    },
  });
};

export default useGetUserTransactions;
