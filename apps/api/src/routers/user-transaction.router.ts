import { Router } from 'express';
import { UserTransactionController } from '@/controllers/user-transaction.controller';
import { verifyToken } from '@/middlewares/verifyToken'; 

export class UserTransactionRouter {
  private router: Router;
  private userTransactionController: UserTransactionController;

  constructor() {
    this.userTransactionController = new UserTransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.userTransactionController.getUserTransactions);
    this.router.post('/create-transaction', verifyToken, this.userTransactionController.createBookingTransaction);
  }

  getRouter(): Router {
    return this.router;
  }
}
