import { Router } from 'express';
import { TransactionController } from '@/controllers/tenant-transaction.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { tenantGuard } from '@/middlewares/tenantGuard';

export class TenantTransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      tenantGuard,
      this.transactionController.getTransactions,
    );

    this.router.post(
      '/:id/confirm',
      verifyToken,
      tenantGuard,
      this.transactionController.confirmPayment,
    );

    this.router.post(
      '/:id/cancel',
      verifyToken,
      tenantGuard,
      this.transactionController.cancelOrder,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
