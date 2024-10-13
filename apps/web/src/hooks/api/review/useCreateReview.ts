import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios'; 
import { toast } from 'react-toastify';

interface CreateReviewPayload {
  transactionId: number;
  propertyId: number;
  rating: number;
  review: string;
}

interface ReviewResponse {
  id: number;
  userId: number;
  transactionId: number;
  propertyId: number;
  rating: number;
  review: string;
  createdAt: string;
}

const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios(); 

  return useMutation<ReviewResponse, Error, CreateReviewPayload>({
    mutationFn: async (reviewPayload: CreateReviewPayload) => {
      console.log('Sending review payload:', reviewPayload); 
      const { data } = await axiosInstance.post<ReviewResponse>(
        `/review/${reviewPayload.transactionId}/property/${reviewPayload.propertyId}/create`,
        {
          rating: reviewPayload.rating,
          review: reviewPayload.review,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success('Review submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', data.transactionId] });
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast.error(`Review submission failed: ${error.message}`);
    },
  });
};

export default useCreateReview;
