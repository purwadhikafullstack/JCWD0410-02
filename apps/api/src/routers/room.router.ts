import { RoomController } from '@/controllers/room.controller';
import { uploader } from '@/lib/multer';
import { tenantGuard } from '@/middlewares/tenantGuard';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class RoomRouter {
  private router: Router;
  private roomController: RoomController;

  constructor() {
    this.roomController = new RoomController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:id', this.roomController.getRoomController);
    this.router.patch(
      '/:id',
      verifyToken,
      tenantGuard,
      uploader().single('imageUrl'),
      this.roomController.updateRoomController,
    );
    this.router.get(
      '/',
      verifyToken,
      tenantGuard,
      this.roomController.getRoomsController,
    );
    this.router.post(
      '/',
      verifyToken,
      tenantGuard,
      uploader().single('imageUrl'),
      this.roomController.createRoomController,
    );
    this.router.patch(
      '/delete/:id',
      verifyToken,
      tenantGuard,
      this.roomController.deleteRoomController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
