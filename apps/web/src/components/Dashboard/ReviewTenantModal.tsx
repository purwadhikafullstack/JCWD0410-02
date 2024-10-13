'use client';

import useReplyReview from "@/hooks/api/review/useCreateTenantReview";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ReviewFormData {
  reply: string;
}

interface CreateReviewModalProps {
  transaction: any; 
  reviewId: number | null; 
  closeModal: () => void;
  refetch: () => void;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({ transaction, reviewId, closeModal, refetch }) => {
  const { mutateAsync: replyReview } = useReplyReview();
  const { register, handleSubmit } = useForm<ReviewFormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReviewSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    if (!reviewId) {
      setErrorMessage("Review ID is missing.");
      return;
    }

    try {
      await replyReview({
        reviewId,
        reply: data.reply,
      });
      refetch(); 
      closeModal(); 
    } catch (error) {
      setErrorMessage("Failed to submit reply. Please try again.");
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-500 bg-opacity-75 fixed inset-0" onClick={closeModal}></div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl sm:max-w-lg w-full relative z-20">
          <div className="p-4">
            <h4 className="text-lg font-semibold">Reply to Review</h4>
            <form onSubmit={handleSubmit(handleReviewSubmit)}>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Reply</label>
                <textarea
                  {...register("reply", { required: true })}
                  className="border-gray-300 rounded-lg shadow-sm w-full"
                  placeholder="Write your reply"
                />
              </div>
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
              <div className="mt-6">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Submit Reply
                </button>
                <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewModal;
