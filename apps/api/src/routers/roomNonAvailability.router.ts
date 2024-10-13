import { RoomNonAvailabilityController } from '@/controllers/roomNonAvailability.controller';
import { tenantGuard } from '@/middlewares/tenantGuard';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class RoomNonAvailabilityRouter {
  private router: Router;
  private roomNonAvailabilityRouter: RoomNonAvailabilityController;

  constructor() {
    this.roomNonAvailabilityRouter = new RoomNonAvailabilityController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      tenantGuard,
      this.roomNonAvailabilityRouter.getRoomNonAvailabilitiesController,
    );
    this.router.post(
      '/',
      verifyToken,
      tenantGuard,
      this.roomNonAvailabilityRouter.createRoomNonAvailabilityController,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      tenantGuard,
      this.roomNonAvailabilityRouter.updateRoomNonAvailabilitiyController,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      tenantGuard,
      this.roomNonAvailabilityRouter.deleteRoomNonAvailabilityController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
