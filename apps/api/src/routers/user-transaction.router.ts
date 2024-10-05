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
    // Route untuk mendapatkan transaksi pengguna
    this.router.get('/', verifyToken, this.userTransactionController.getUserTransactions.bind(this.userTransactionController));

    // Route untuk membuat booking kamar (pemesanan)
    this.router.post('/booking/:slug', verifyToken, this.userTransactionController.createBooking.bind(this.userTransactionController));
  }

  getRouter(): Router {
    return this.router;
  }
}
