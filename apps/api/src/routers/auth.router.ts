// import { SampleController } from '@/controllers/sample.controller';
import { AuthController } from '@/controllers/auth.controller';
import { verifyToken } from '@/middlewares/verifyToken';
// import { registerValidator } from '@/middlewares/registerValidator';
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
    this.router.post(
      '/register',
      // registerValidator,
      this.authController.registerController,
    );
    this.router.patch(
      '/verification',
      verifyToken,
      // verificationValidator,
      this.authController.verifyController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
