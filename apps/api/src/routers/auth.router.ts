// import { SampleController } from '@/controllers/sample.controller';
import { AuthController } from '@/controllers/auth.controller';
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
    this.router.post(
      '/register',
      // registerValidator,
      this.authController.registerController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
