import prisma from '@/prisma';
import { StatusTransaction, PaymentMethode } from '@prisma/client';
import { MidtransClient } from 'midtrans-node-client'; 
import schedule from 'node-schedule';
import { format } from 'date-fns';  

interface CreateTransactionBody {
  roomId: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  paymentMethode: PaymentMethode;
}

export const createTransactionService = async (body: CreateTransactionBody) => {
  const { roomId, startDate, endDate, userId, paymentMethode } = body;

  try {
    return await prisma.$transaction(async (prismaTransaction) => {
      console.log(`Checking RoomNonAvailability for roomId ${roomId}`);
      const nonAvailableDates = await prismaTransaction.roomNonAvailability.findFirst({
        where: {
          roomId,
          isDeleted: false,
          AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
        },
      });

      if (nonAvailableDates) {
        throw new Error('Room is not available on the selected dates');
      }

      const overlappingTransactions = await prismaTransaction.transaction.findMany({
        where: {
          roomId,
          status: {
            in: [
              StatusTransaction.WAITING_FOR_PAYMENT,
              StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION,
              StatusTransaction.PROCESSED,
            ],
          },
          AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
        },
      });

      if (overlappingTransactions.length > 0) {
        throw new Error('Room is not available on the selected dates. Another transaction is pending.');
      }

      const room = await prismaTransaction.room.findUnique({
        where: { id: roomId, isDeleted: false },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      if (room.stock <= 0) {
        throw new Error('Room is not available on the selected dates.');
      }

      let totalAmount = 0;
      let currentDate = new Date(startDate);
      let peakSeasonPrices: { date: string; price: number }[] = [];

      while (currentDate < endDate) {
        let dayEnd = new Date(currentDate);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const peakSeasonRate = await prismaTransaction.peakSeasonRate.findFirst({
          where: {
            roomId,
            isDeleted: false,
            AND: [{ startDate: { lte: currentDate } }, { endDate: { gte: currentDate } }],
          },
        });

        if (peakSeasonRate) {
          totalAmount += peakSeasonRate.price;
          peakSeasonPrices.push({ date: currentDate.toISOString().split('T')[0], price: peakSeasonRate.price });
        } else {
          totalAmount += room.price;
        }

        currentDate = dayEnd;
      }

      const createdAt = new Date();
      const expiredAt = new Date(createdAt.getTime() + 60 * 60 * 1000); 
      
      let snapTransaction = null; 

      if (paymentMethode === PaymentMethode.OTOMATIS) {
        const midtransClient = new MidtransClient.Snap({
          isProduction: false, 
          serverKey: process.env.MIDTRANS_SERVER_KEY || 'your-server-key',
          clientKey: process.env.MIDTRANS_CLIENT_KEY || 'your-client-key',
        });

        const midtransTransactionDetails = {
          transaction_details: {
            order_id: `transaction-${new Date().getTime()}`,
            gross_amount: totalAmount,
          },
          customer_details: {
            user_id: userId,
            room_id: roomId,
            start_date: startDate,
            end_date: endDate,
          },
          expiry: {
            start_time: format(createdAt, 'yyyy-MM-dd HH:mm:ss XXX'),  
            unit: 'hour',
            duration: 1, 
          },
        };

        try {
          snapTransaction = await midtransClient.createTransaction(midtransTransactionDetails);
        } catch (error: any) {
          throw new Error('Failed to create transaction with Midtrans: ' + (error.message || error));
        }
      }

      const transaction = await prismaTransaction.transaction.create({
        data: {
          roomId,
          userId,
          total: totalAmount,
          startDate,
          endDate,
          paymentMethode,
          status: StatusTransaction.WAITING_FOR_PAYMENT,
          expiredAt,
          snapToken: snapTransaction?.token || null, 
          snapRedirectUrl: snapTransaction?.redirect_url || null, 
        },
      });

      await prismaTransaction.room.update({
        where: { id: roomId },
        data: { stock: { decrement: 1 } },
      });

      schedule.scheduleJob(new Date(endDate), async () => {
        const currentTransaction = await prisma.transaction.findUnique({
          where: { id: transaction.id },
        });

        if (currentTransaction?.status === StatusTransaction.PROCESSED) {
          await prisma.room.update({
            where: { id: roomId },
            data: { stock: { increment: 1 } }, 
          });
        }
      });

      schedule.scheduleJob(expiredAt, async () => {
        const currentTransaction = await prisma.transaction.findUnique({
          where: { id: transaction.id },
        });

        if (currentTransaction?.status === StatusTransaction.WAITING_FOR_PAYMENT) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: StatusTransaction.CANCELLED },
          });

          await prisma.room.update({
            where: { id: roomId },
            data: { stock: { increment: 1 } },
          });
        }
      });

      return {
        transaction,
        peakSeasonPrices,
        remainingStock: room.stock - 1,
        snapTransaction, 
      };
    });
  } catch (error) {
    throw Error
  }
};
