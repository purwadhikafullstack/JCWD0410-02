import { replyReviewService } from '@/services/review/create-tenantreview.service';
import { createReviewService } from '@/services/review/create-userreview.service';
import { Request, Response, NextFunction } from 'express';

export class UserReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;
      const transactionId = parseInt(req.params.transactionId);
      const propertyId = parseInt(req.params.propertyId);
      const { rating, review } = req.body;

      console.log('Received review creation request:', {
        userId,
        transactionId,
        propertyId,
        rating,
        review,
      });

      if (!userId || !transactionId || !propertyId || !rating || !review) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newReview = await createReviewService({
        userId,
        transactionId,
        propertyId,
        rating,
        review,
      });

      return res.status(201).json({ message: 'Review created successfully', data: newReview });
    } catch (error) {
      console.error('Error creating review:', error);
      next(error);
    }
  }

  async replyReview(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = res.locals.user?.id; 
      const reviewId = parseInt(req.params.reviewId); 
      const { reply } = req.body; 

      console.log('Received reply creation request:', {
        tenantId,
        reviewId,
        reply,
      });

      if (!tenantId || !reviewId || !reply) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const updatedReview = await replyReviewService({
        tenantId,
        reviewId,
        reply,
      });

      return res.status(200).json({
        message: 'Reply added successfully',
        data: updatedReview,
      });
    } catch (error) {
      console.error('Error replying to review:', error);
      next(error);
    }
  }
}
