
import { getTransactionsService } from '@/services/tenanttransactions/orderlist.service';
import { NextFunction, Request, Response } from 'express';

export class TransactionController {

  // Metode untuk mengambil daftar transaksi
// Controller Method untuk mendapatkan daftar transaksi
async getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantIdString = req.query.tenantId as string;
    const tenantId = parseInt(tenantIdString, 10);

    // Query params untuk filter dan paginasi
    const page = parseInt(req.query.page as string) || 1;
    const take = parseInt(req.query.take as string) || 10;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const search = req.query.search as string || '';
    const status = req.query.status as string;

    // Memanggil service untuk mendapatkan transaksi dengan filter yang diinginkan
    const transactions = await getTransactionsService({
      tenantId,
      page,
      take,
      sortBy,
      sortOrder,
      search,
      status: status as any
    });

    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}
}
