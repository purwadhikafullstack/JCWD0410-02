import { AuthController } from '@/controllers/auth.controller';
import { uploader } from '@/lib/multer';
import { tenantGuard } from '@/middlewares/tenantGuard';
import {
  validateLogin,
  validateRegister,
  validateVerification,
} from '@/middlewares/validator';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      validateRegister,
      this.authController.registerController,
    );
    this.router.patch(
      '/verification',
      verifyToken,
      validateVerification,
      this.authController.verifyController,
    );
    this.router.patch(
      '/verification-tenant',
      verifyToken,
      this.authController.verifyTenantController,
    );
    this.router.post('/login', validateLogin, this.authController.login);
    this.router.post(
      '/forgot-password',
      this.authController.forgotPasswordController,
    );
    this.router.patch(
      '/reset-password',
      verifyToken,
      this.authController.resetPasswordController,
    );
    // this.router.post('/google', this.authController.GoogleController);
    this.router.post('/google', this.authController.loginWithGoogleController);

    this.router.patch(
      '/change-password/:id',
      verifyToken,
      this.authController.changePassword,
    );
    this.router.patch(
      '/change-email',
      verifyToken,
      this.authController.changeEmailController,
    );
    this.router.patch(
      '/verify-email',
      verifyToken,
      this.authController.changeEmailVerificationController,
    );
    this.router.patch(
      '/tenant/:id',
      verifyToken,
      tenantGuard,
      uploader().single('imageUrl'),
      this.authController.updateTenantController,
    );
    this.router.get(
      '/tenant/',
      verifyToken,
      tenantGuard,
      this.authController.getTenantController,
    );
    this.router.get('/:id', verifyToken, this.authController.getUserController);
    this.router.patch(
      '/:id',
      verifyToken,
      uploader().single('imageUrl'),
      this.authController.updateProfileController,
    );
    this.router.get('/:id', verifyToken, this.authController.getUserController);
  }

  getRouter(): Router {
    return this.router;
  }
}
