import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken'; // Middleware untuk verifikasi token
import { SalesReportController } from '@/controllers/salesreport.controller';

export class SalesReportRouter {
  private router: Router;
  private salesReportController: SalesReportController;

  constructor() {
    this.salesReportController = new SalesReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Endpoint untuk mendapatkan laporan penjualan dengan filter dan sorting
    this.router.get(
      '/',
      verifyToken,
      this.salesReportController.getSalesReport,
    ); // Verifikasi token
  }

  // Method untuk mengembalikan instance router
  getRouter(): Router {
    return this.router;
  }
}
