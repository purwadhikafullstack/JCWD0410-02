import { Router } from 'express';
import { TransactionController } from '@/controllers/tenant-transaction.controller';
import { verifyToken } from '@/middlewares/verifyToken'; // Import middleware

export class TenantTransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.transactionController.getTransactions); // Verifikasi token
    this.router.post('/:id/confirm', verifyToken, this.transactionController.confirmPayment);
    this.router.post('/:id/cancel', verifyToken, this.transactionController.cancelOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
