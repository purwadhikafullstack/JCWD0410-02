import * as Yup from 'yup';

export const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .required('Rating is required'),
  review: Yup.string()
    .min(5, 'Review must be at least 5 characters')
    .max(500, 'Review cannot be longer than 500 characters')
    .required('Review is required'),
});
