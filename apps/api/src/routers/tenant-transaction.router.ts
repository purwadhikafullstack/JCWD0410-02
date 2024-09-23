import { Router } from 'express';
import { TransactionController } from '@/controllers/tenant-transaction.controller';

export class TenantTransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.transactionController.getTransactions);
    this.router.post('/:id/confirm', this.transactionController.confirmPayment);
    this.router.post('/:id/cancel', this.transactionController.cancelOrder); 
  }

  getRouter(): Router {
    return this.router;
  }
}
