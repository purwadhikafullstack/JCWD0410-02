import { Router } from 'express';
import { MidtransWebhookController } from '@/controllers/midtrans-webhook.controller';

export class MidtransRouter {
  private router: Router;
  private midtransWebhookController: MidtransWebhookController;

  constructor() {
    this.midtransWebhookController = new MidtransWebhookController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/webhook/midtrans',
      this.midtransWebhookController.handleWebhook
    );

    this.router.post(
      '/:id/process',
      this.midtransWebhookController.processOrder
    );

    this.router.post(
      '/:id/cancel',
      this.midtransWebhookController.cancelOrder
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
