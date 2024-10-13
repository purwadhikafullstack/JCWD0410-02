import { Router } from 'express';
import { UserReviewController } from '@/controllers/review.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { createReviewValidation, handleValidationErrors, replyReviewValidation } from '@/validators/reviewValidator';

export class ReviewRouter {
  private router: Router;
  private reviewController: UserReviewController;

  constructor() {
    this.reviewController = new UserReviewController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/:transactionId/property/:propertyId/create',
      verifyToken,
      createReviewValidation, 
      handleValidationErrors, 
      this.reviewController.createReview
    );

    // Endpoint untuk tenant membalas review
    this.router.post(
      '/:reviewId/reply',
      verifyToken,
      replyReviewValidation, 
      handleValidationErrors, 
      this.reviewController.replyReview
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
