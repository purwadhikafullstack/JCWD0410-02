import { createBookingTransaction } from '@/services/usertransactions/create-userreservation.service';
import { getUserTransactionsService } from '@/services/usertransactions/orderlist-user.service';

import { Request, Response, NextFunction } from 'express';

export class UserTransactionController {
  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';
      const search = req.query.search as string || ''; 
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined; 
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined; 
      const uuid = req.query.uuid as string; 

      const transactions = await getUserTransactionsService({
        userId,
        page,
        take,
        sortBy,
        sortOrder,
        search,
        dateFrom,
        dateTo,
        uuid,
      });

      return res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  // Method untuk pemesanan kamar (createBooking)
  async createBooking(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.params;
    const { startDate, endDate } = req.body;
    const userId = res.locals.user?.id;  // Menggunakan res.locals.user untuk mendapatkan userId dari token

    if (!slug || !startDate || !endDate) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    try {
      const transaction = await createBookingTransaction(
        slug,
        new Date(startDate),
        new Date(endDate),
        userId,  // userId dari res.locals.user
      );

      return res.status(201).json({ success: true, transaction });
    } catch (error) {
      next(error);
    }
  }
}
