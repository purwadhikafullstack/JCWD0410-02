import { AuthController } from '@/controllers/auth.controller';
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
    this.router.get('/:id', verifyToken, this.authController.getUserController);
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
  }

  getRouter(): Router {
    return this.router;
  }
}
