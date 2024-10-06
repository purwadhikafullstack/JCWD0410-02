import { PeakSeasonRateController } from '@/controllers/peakSeasonRate.controller';
import { tenantGuard } from '@/middlewares/TenantGuard';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class PeakSeasonRateRouter {
  private router: Router;
  private peakSeasonRateController: PeakSeasonRateController;

  constructor() {
    this.peakSeasonRateController = new PeakSeasonRateController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      this.peakSeasonRateController.getPeakSeasonsController,
    );
    this.router.post(
      '/',
      verifyToken,
      tenantGuard,
      this.peakSeasonRateController.createPeakSeasonRateontroller,
    );
    this.router.patch(
      '/:id',
      this.peakSeasonRateController.updatePeakSeasonRateontroller,
    );
    this.router.delete(
      '/:id',
      this.peakSeasonRateController.deletePeakSeasonRateontroller,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
