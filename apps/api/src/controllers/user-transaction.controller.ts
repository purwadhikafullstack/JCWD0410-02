import { createBookingTransaction } from '@/services/usertransactions/create-userreservation.service';
import { getUserTransactionsService } from '@/services/usertransactions/orderlist-user.service';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class UserTransactionController {
  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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

  // Controller untuk membuat transaksi booking dengan menggunakan user dari JWT token
  async createBookingTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, startDate, endDate } = req.body;
      const userId = res.locals.user?.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      // Convert string dates to actual Date objects (if they are in string form)
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const transaction = await createBookingTransaction(roomId, start, end, userId);
      return res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}
