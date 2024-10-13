import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken'; 
import { SalesPropertyController } from '@/controllers/salesreport.controller';
import { tenantGuard } from '@/middlewares/tenantGuard';

export class SalesPropertyRouter {
  private router: Router;
  private salesPropertyController: SalesPropertyController;

  constructor() {
    this.salesPropertyController= new SalesPropertyController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      tenantGuard,
      this.salesPropertyController.getSalesReport,
    ); 

    this.router.get(
      '/propertyreport',
      verifyToken,
      tenantGuard,
      this.salesPropertyController.getPropertyReport, 
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
