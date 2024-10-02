import { Router } from 'express';
import { TransactionController } from '@/controllers/tenant-transaction.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { check } from 'express-validator';

export class TenantTransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Mendapatkan daftar transaksi
    this.router.get(
      '/',
      verifyToken,
      [
        check('page').optional().isInt({ min: 1 }).withMessage('Page harus berupa angka positif'),
        check('take').optional().isInt({ min: 1 }).withMessage('Take harus berupa angka positif'),
        check('sortBy').optional().isString().withMessage('SortBy harus berupa string'),
        check('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder harus berupa asc atau desc'),
        check('search').optional().isString().withMessage('Search harus berupa string'),
        check('status').optional().isString().withMessage('Status harus berupa string yang valid'),
      ],
      this.transactionController.getTransactions,
    );

    // Konfirmasi pembayaran
    this.router.post(
      '/:id/confirm',
      verifyToken,
      [
        check('id').isInt().withMessage('Transaction ID harus berupa angka'),
        check('confirm').isBoolean().withMessage('Field confirm harus berupa boolean'),
      ],
      this.transactionController.confirmPayment,
    );

    // Membatalkan order
    this.router.post(
      '/:id/cancel',
      verifyToken,
      [
        check('id').isInt().withMessage('Transaction ID harus berupa angka'),
      ],
      this.transactionController.cancelOrder,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
