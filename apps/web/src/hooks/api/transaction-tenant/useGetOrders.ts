import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { IPageableResponse } from '@/types/pagination';
import useAxios from '@/hooks/useAxios';

interface GetTransactionsQuery {
  tenantId?: number; // tenantId sekarang bisa undefined jika belum tersedia
  status?: string;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const useGetTransactions = (queries: GetTransactionsQuery) => {
  const { axiosInstance } = useAxios();
  return useQuery<IPageableResponse<Transaction>, Error>({
    queryKey: ['transactions', queries],
    queryFn: async () => {
      if (!queries.tenantId) {
        throw new Error("Tenant ID is required");
      }
      const { data } = await axiosInstance.get<IPageableResponse<Transaction>>(
        '/tenanttransactions', 
        {
          params: queries,
        }
      );
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useGetTransactions;
