import { PropertyController } from '@/controllers/property.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class PropertyRouter {
  private router: Router;
  private propertyController: PropertyController;

  constructor() {
    this.propertyController = new PropertyController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:slug', this.propertyController.getPropertyController);
    this.router.get('/', this.propertyController.getPropertiesController);
  }

  getRouter(): Router {
    return this.router;
  }
}
