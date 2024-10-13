import prisma from '@/prisma';

interface ReplyReviewBody {
  tenantId: number;
  reviewId: number;
  reply: string;
}

export const replyReviewService = async (body: ReplyReviewBody) => {
  const { tenantId, reviewId, reply } = body;

  try {
    console.log(`Attempting to reply to review with ID: ${reviewId} by tenant: ${tenantId}`);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        property: true, 
      },
    });

    if (!review) {
      console.error(`Review with ID ${reviewId} not found`);
      throw new Error('Review not found.');
    }
    if (review.property.tenantId !== tenantId) {
      console.error(
        `Tenant ID mismatch: Review property tenant ID is ${review.property.tenantId}, but request tenant ID is ${tenantId}`
      );
      throw new Error('You do not have permission to reply to this review.');
    }

    if (review.review.includes('\nReply:')) {
      console.error(`Review with ID ${reviewId} has already been replied to.`);
      throw new Error('This review has already been replied to.');
    }

    const updatedReviewContent = `${review.review}\nReply: ${reply}`;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        review: updatedReviewContent,
      },
    });

    console.log(`Successfully updated review with ID ${reviewId}`);
    return updatedReview;
  } catch (error) {
    console.error('Error in replyReviewService:', error);
    throw error;
  }
};
