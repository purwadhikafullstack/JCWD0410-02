import { createTransactionService } from '@/services/usertransactions/create-userreservation.service';
import { getRoomDetailsService } from '@/services/usertransactions/get-RoomDetail.service';
import { getUserTransactionService } from '@/services/usertransactions/get-userstransaction.service';
import { getUserOrderListService } from '@/services/usertransactions/orderlist-user.service';
import { uploadPaymentProofService } from '@/services/usertransactions/upload-paymentproff.service';
import { Request, Response, NextFunction } from 'express';

export class UserTransactionController {
  async getOrderListTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'User ID is missing or invalid' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const take = parseInt(req.query.take as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'desc';
      const search = (req.query.search as string) || '';
      const dateFrom = req.query.dateFrom
        ? new Date(req.query.dateFrom as string)
        : undefined;
      const dateTo = req.query.dateTo
        ? new Date(req.query.dateTo as string)
        : undefined;
      const uuid = req.query.uuid as string;

      const transactions = await getUserOrderListService({
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
  async getTransactionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract userId from res.locals.user, set by authentication middleware
      const userId = res.locals.user?.id;

      // Extract transactionId from the request parameters
      const transactionId = parseInt(req.params.id);

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'User ID is missing or invalid' });
      }

      if (!transactionId) {
        return res
          .status(400)
          .json({ message: 'Transaction ID is missing or invalid' });
      }

      // Call service to get the transaction details along with stock
      const transactionDetails = await getUserTransactionService({
        userId,
        transactionId,
      });

      return res.status(200).json(transactionDetails);
    } catch (error) {
      // Error handling, pass error to the next middleware
      next(error);
    }
  }

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id; 
      const transactionId = parseInt(req.params.id); 

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await uploadPaymentProofService(
        userId,
        transactionId,
        req.file,
      );

      return res.status(200).json({
        message:
          'Payment proof uploaded successfully and cancellation scheduled.',
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;
      const { startDate, endDate } = req.body;
      const roomId = parseInt(req.params.id);

      if (!roomId || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { transaction, peakSeasonPrices, remainingStock } =
        await createTransactionService({
          roomId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          userId,
        });

      return res
        .status(201)
        .json({ transaction, peakSeasonPrices, remainingStock });
    } catch (error) {
      next(error);
    }
  }

  async getRoomDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // Ambil roomId dari parameter URL
      const roomId = req.params.id; 
      
      // Ambil startDate dan endDate dari query parameters
      const { startDate, endDate } = req.query;
      
      // Pastikan bahwa userId diambil dari res.locals setelah otentikasi
      const userId = res.locals.user?.id;
      
      // Validasi input
      if (!roomId || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required parameters: roomId, startDate, and endDate are required' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is required' });
      }

  
      const roomDetails = await getRoomDetailsService({
        roomId: parseInt(roomId, 10), // Konversi roomId menjadi angka
        startDate: new Date(startDate as string), // Konversi startDate menjadi Date object
        endDate: new Date(endDate as string), // Konversi endDate menjadi Date object
        userId,
      });

 
      if (!roomDetails.isAvailable) {
        return res.status(200).json({
          isAvailable: false,
          message: roomDetails.reason,
        });
      }

      
      return res.status(200).json({
        isAvailable: true,
        totalAmount: roomDetails.totalAmount,
        peakSeasonPrices: roomDetails.peakSeasonPrices,
        remainingStock: roomDetails.remainingStock,
      });

    } catch (error) {
      console.error('Error in getRoomDetails:', error);
      next(error); // Pass error to the next middleware for handling
    }
  }
}
