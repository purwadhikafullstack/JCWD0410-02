import { useQuery } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios';

interface GetTransactionDetailsResponse {
  createdAt: string | number | Date; 
  buyerName: string;                 
  bankName: string;                 
  bankNumber: string;                
  totalAmount: number;               
  remainingStock: number;           
  peakSeasonPrices?: {               
    date: string;                   
    price: number;                   
  }[];
}

const useGetTransactionDetails = (transactionId: number) => {
  const { axiosInstance } = useAxios(); 

  return useQuery<GetTransactionDetailsResponse, Error>({
    queryKey: ['transactionDetails', transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetTransactionDetailsResponse>(
        `/usertransactions/${transactionId}`
      );
      return data;
    },
    enabled: !!transactionId, 
  });
};

export default useGetTransactionDetails;
