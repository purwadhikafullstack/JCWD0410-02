import { cancelOrderService } from '@/services/tenanttransactions/cancelorder.service';
import { confirmPaymentService } from '@/services/tenanttransactions/confirmpayment.service';
import { getTenantIdsByUserId, getTransactionsService } from '@/services/tenanttransactions/orderlist.service';
import { NextFunction, Request, Response } from 'express';

export class TransactionController {
  // Metode untuk mengambil daftar transaksi berdasarkan tenant ID dari token
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const tenantIds = await getTenantIdsByUserId(userId);

      if (tenantIds.length === 0) {
        return res.status(400).json({ message: 'User is not associated with any tenant' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';
      const search = req.query.search as string || '';
      const status = req.query.status as string;

      const transactions = await getTransactionsService({
        tenantIds,
        page,
        take,
        sortBy,
        sortOrder,
        search,
        status: status as any,
      });

      return res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  // Konfirmasi pembayaran
  async confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = parseInt(req.params.id);
      const confirm = req.body.confirm;
      const result = await confirmPaymentService(transactionId, confirm);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  // Membatalkan order
  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = parseInt(req.params.id);
      const result = await cancelOrderService(transactionId);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
