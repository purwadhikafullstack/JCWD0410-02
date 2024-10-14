import { cancelOrderService } from '@/services/midtrans/update-canceled.service';
import { processOrderService } from '@/services/midtrans/update-confirm.status.service';
import { updateTransactionStatusService } from '@/services/midtrans/update-transaction-status.service';
import { Request, Response, NextFunction } from 'express';

export class MidtransWebhookController {
  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, transaction_status } = req.body;

      if (!order_id || !transaction_status) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const updatedTransaction = await updateTransactionStatusService(
        order_id,
        transaction_status,
      );

      return res.status(200).json({
        message: 'Transaction status updated successfully',
        transaction: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async processOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID format' });
      }

      const updatedTransaction = await processOrderService(transactionId);

      return res.status(200).json({
        message: 'Transaction processed successfully',
        transaction: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID format' });
      }

      const updatedTransaction = await cancelOrderService(transactionId);

      return res.status(200).json({
        message: 'Transaction cancelled successfully',
        transaction: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  }

}
