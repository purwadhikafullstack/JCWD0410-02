import { AuthController } from '@/controllers/auth.controller';
import { uploader } from '@/lib/multer';
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
    this.router.post('/register', this.authController.registerController);
    this.router.patch(
      '/verification',
      verifyToken,
      this.authController.verifyController,
    );
    this.router.post('/login', this.authController.login);
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
      '/:id',
      uploader().single('imageUrl'),
      this.authController.updateProfileController,
    );
    this.router.get('/:id', verifyToken, this.authController.getUserController);
  }

  getRouter(): Router {
    return this.router;
  }
}
