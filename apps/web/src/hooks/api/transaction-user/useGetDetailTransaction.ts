import { useQuery } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios';

interface GetTransactionDetailsResponse {
  createdAt: string | number | Date;  // Tanggal pembuatan transaksi
  buyerName: string;                  // Nama pembeli (User yang membuat transaksi)
  bankName: string;                   // Nama bank tenant
  bankNumber: string;                 // Nomor rekening tenant
  totalAmount: number;                // Jumlah total yang harus dibayarkan
  remainingStock: number;             // Sisa stok kamar
  peakSeasonPrices?: {                // Optional array of peak season prices
    date: string;                     // Tanggal peak season
    price: number;                    // Harga peak season per hari
  }[];
}

const useGetTransactionDetails = (transactionId: number) => {
  const { axiosInstance } = useAxios(); // Axios instance dari hook useAxios

  return useQuery<GetTransactionDetailsResponse, Error>({
    queryKey: ['transactionDetails', transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetTransactionDetailsResponse>(
        `/usertransactions/${transactionId}`
      );
      return data;
    },
    enabled: !!transactionId, // Hanya mengaktifkan query jika transactionId ada
  });
};

export default useGetTransactionDetails;
