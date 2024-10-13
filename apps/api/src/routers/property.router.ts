import { PropertyController } from '@/controllers/property.controller';
import { uploader } from '@/lib/multer';
import { tenantGuard } from '@/middlewares/tenantGuard';
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
    this.router.get(
      '/search',
      this.propertyController.getPropertiesByQueryController,
    );
    this.router.get(
      '/tenant',
      verifyToken,
      tenantGuard,
      this.propertyController.getTenantPropertiesController,
    );
    this.router.get('/:slug', this.propertyController.getPropertyController);
    this.router.get(
      '/management/:id',
      this.propertyController.getPropertyTenantController,
    );
    this.router.patch(
      '/management/:id',
      verifyToken,
      tenantGuard,
      uploader().single('imageUrl'),
      this.propertyController.updatePropertyController,
    );
    this.router.get('/', this.propertyController.getPropertiesController);
    this.router.post(
      '/',
      verifyToken,
      tenantGuard,
      uploader().single('imageUrl'),
      this.propertyController.createPropertyController,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      tenantGuard,
      this.propertyController.deletePropertyController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
