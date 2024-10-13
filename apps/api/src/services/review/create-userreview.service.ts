import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

interface CreateReviewBody {
  userId: number;
  transactionId: number;
  propertyId: number;
  rating: number;
  review: string;
}

export const createReviewService = async (body: CreateReviewBody) => {
  const { userId, transactionId, propertyId, rating, review } = body;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        reviews: true,
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found.');
    }

    if (transaction.status !== StatusTransaction.PROCESSED) {
      throw new Error('You can only review a processed transaction.');
    }

    const currentDate = new Date();
    if (currentDate < new Date(transaction.endDate)) {
      throw new Error('You can only write a review after the check-out date.');
    }

    if (transaction.reviews.length > 0) {
      throw new Error('You can only write one review per transaction.');
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        transactionId,
        propertyId,
        rating,
        review,
      },
    });

    return newReview;
  } catch (error) {
    throw Error
  }
};
