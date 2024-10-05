import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface CreateBookingPayload {
  slug: string;
  startDate: string;
  endDate: string;
}

interface TransactionResponse {
  success: boolean;
  transaction: {
    id: number;
    status: string;
    total: number;
    startDate: string;
    endDate: string;
  };
}

const useCreateBooking = () => {
  return useMutation<TransactionResponse, Error, CreateBookingPayload>({
    mutationFn: async (bookingPayload: CreateBookingPayload) => {
      const { data } = await axios.post<TransactionResponse>(
        `/booking/${bookingPayload.slug}`,
        {
          startDate: bookingPayload.startDate,
          endDate: bookingPayload.endDate,
        }
      );
      return data;
    },
  });
};

export default useCreateBooking;
