import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '@/hooks/useAxios'; 
import { toast } from 'react-toastify';

interface ReplyReviewPayload {
  reviewId: number;
  reply: string;
}

interface ReviewResponse {
  id: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

const useReplyReview = () => {
  const queryClient = useQueryClient();
  const { axiosInstance } = useAxios();

  return useMutation<ReviewResponse, Error, ReplyReviewPayload>({
    mutationFn: async (replyPayload: ReplyReviewPayload) => {
      if (!replyPayload.reviewId) {
        throw new Error('Review ID is missing.');
      }
      console.log('Sending reply payload:', replyPayload);
      const { data } = await axiosInstance.post<ReviewResponse>(
        `/review/${replyPayload.reviewId}/reply`,
        {
          reply: replyPayload.reply,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success('Reply submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['reviews', data.id] });
    },
    onError: (error) => {
      console.error('Error submitting reply:', error);
      toast.error(`Reply submission failed: ${error.message}`);
    },
  });
};

export default useReplyReview;
