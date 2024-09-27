import { PropertyController } from '@/controllers/property.controller';
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
    this.router.get('/', this.propertyController.getPropertyController);
  }

  getRouter(): Router {
    return this.router;
  }
}
