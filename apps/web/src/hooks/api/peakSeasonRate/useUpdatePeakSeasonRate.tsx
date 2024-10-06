'use client';

import useAxios from '@/hooks/useAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UpdatePeakSeasonPayload {
  id: number;
  price: number;
}

const useUpdatePeakSeason = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePeakSeasonPayload) => {
      const { data } = await axiosInstance.patch(
        `/peakSeasonRate/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['peakSeasonRate'] });
      toast.success('Update Peak Season Rate success');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data);
    },
  });
};

export default useUpdatePeakSeason;
