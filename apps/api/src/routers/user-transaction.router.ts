import { Router } from 'express';
import { UserTransactionController } from '@/controllers/user-transaction.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { uploader } from '@/lib/multer';

export class UserTransactionRouter {
  private router: Router;
  private userTransactionController: UserTransactionController;

  constructor() {
    this.userTransactionController = new UserTransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      this.userTransactionController.getOrderListTransactions,
    );

    this.router.get(
      '/:id',
      verifyToken,
      this.userTransactionController.getTransactionDetails,
    );

    this.router.post(
      '/:id/create',
      verifyToken,
      this.userTransactionController.createTransaction,
    );

    this.router.post(
      '/:id/upload-proof',
      verifyToken,
      uploader().single('paymentProof'),
      this.userTransactionController.uploadPaymentProof,
    );

    this.router.get(
      '/:id/room-details',
      verifyToken,
      this.userTransactionController.getRoomDetails,
    );

    this.router.patch(
      '/:id/cancel',
      verifyToken,
      this.userTransactionController.cancelTransaction,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
