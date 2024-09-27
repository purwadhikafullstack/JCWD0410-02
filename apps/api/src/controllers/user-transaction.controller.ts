import { getUserTransactionsService } from '@/services/usertransactions/orderlist-user.service';
import { Request, Response, NextFunction } from 'express';

export class UserTransactionController {
  // Metode untuk mengambil daftar transaksi berdasarkan user ID dari token
  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      // Ambil userId dari res.locals.user (disimpan setelah verifikasi token)
      const userId = res.locals.user?.id;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      // Ambil query untuk pencarian berdasarkan tanggal dan no order (uuid)
      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'desc';
      const search = req.query.search as string || ''; // untuk pencarian
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined; // filter berdasarkan tanggal
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined; // filter berdasarkan tanggal
      const uuid = req.query.uuid as string; // pencarian berdasarkan no order

      // Panggil service untuk mendapatkan transaksi
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
}
