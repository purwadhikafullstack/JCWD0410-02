'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CreatePeakSeasonRatePayload {
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

const useCreatePeakSeasonRate = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePeakSeasonRatePayload) => {
      const { data } = await axiosInstance.post(`/peakSeasonRate/`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['peakSeasonRate'] });
      toast.success('Create Peak Season Rate success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useCreatePeakSeasonRate;
