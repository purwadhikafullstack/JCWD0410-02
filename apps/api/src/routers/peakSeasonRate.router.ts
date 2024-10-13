import { PeakSeasonRateController } from '@/controllers/peakSeasonRate.controller';
import { tenantGuard } from '@/middlewares/tenantGuard';
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
      verifyToken,
      tenantGuard,
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
      verifyToken,
      tenantGuard,
      this.peakSeasonRateController.updatePeakSeasonRateontroller,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      tenantGuard,
      this.peakSeasonRateController.deletePeakSeasonRateontroller,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
