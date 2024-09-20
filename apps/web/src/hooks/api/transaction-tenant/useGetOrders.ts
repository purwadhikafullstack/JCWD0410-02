import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';  // Import axiosInstance from your axios setup
import { Transaction } from '@/types/transaction';  // Import types for transactions
import { IPageableResponse } from '@/types/pagination';  // Import pagination types

// Define the type for the query parameters that will be passed to the API
interface GetTransactionsQuery {
  tenantId: number;  
  status?: string;  
  page?: number;  
  take?: number;  
  sortBy?: string;  
  sortOrder?: 'asc' | 'desc';  
}

const useGetTransactions = (queries: GetTransactionsQuery) => {
  return useQuery<IPageableResponse<Transaction>, Error>({
    queryKey: ['transactions', queries],
  
    queryFn: async () => {
      try {
        console.log("Requesting transactions with queries:", queries); 
        const { data } = await axiosInstance.get<IPageableResponse<Transaction>>(
          '/tenanttransactions',  
          {
            params: queries, 
          }
        );
        
        return data;  
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;  
      }
    },
    
    staleTime: 1000 * 60 * 5,  
    refetchOnWindowFocus: false,  
  });
};

export default useGetTransactions;
