import React from 'react';
import useCreateReview from '@/hooks/api/review/useCreateReview';
import { useFormik } from 'formik';
import { ReviewSchema } from '@/features/transactions/schemas/ReviewSchema';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: number;
  propertyId?: number;
  refetch: () => void;  // Tambahkan prop refetch untuk melakukan update data
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, transactionId, propertyId, refetch }) => {
  const createReviewMutation = useCreateReview();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      review: '',
    },
    validationSchema: ReviewSchema,
    onSubmit: (values) => {
      if (transactionId && propertyId) {
        createReviewMutation.mutate(
          {
            transactionId,
            propertyId,
            rating: values.rating,
            review: values.review,
          },
          {
            onSuccess: () => {
              refetch();  // Refetch data setelah review berhasil dikirim
              onClose();  // Tutup modal setelah submit berhasil
            },
            onError: (error) => {
              console.error('Error submitting review:', error);
            }
          }
        );
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Tulis Review</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              name="rating"
              className="w-full border rounded-lg px-3 py-2"
              value={formik.values.rating}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.rating && formik.errors.rating ? (
              <p className="text-red-500 text-sm">{formik.errors.rating}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Review</label>
            <textarea
              name="review"
              className="w-full border rounded-lg px-3 py-2"
              value={formik.values.review}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.review && formik.errors.review ? (
              <p className="text-red-500 text-sm">{formik.errors.review}</p>
            ) : null}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={createReviewMutation.status === 'pending'} 
            >
              {createReviewMutation.status === 'pending' ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
