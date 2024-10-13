import prisma from '@/prisma';
import { StatusTransaction, PaymentMethode } from '@prisma/client';
import schedule from 'node-schedule';

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
        },
      });

      await prismaTransaction.room.update({
        where: { id: roomId },
        data: { stock: { decrement: 1 } },
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

      schedule.scheduleJob(new Date(endDate), async () => {
        const currentTransaction = await prisma.transaction.findUnique({
          where: { id: transaction.id },
        });

        if (currentTransaction?.status === StatusTransaction.PROCESSED) {
          await prisma.room.update({
            where: { id: roomId },
            data: { stock: { increment: 1 } }, 
          });

          console.log(`Stock room with ID ${roomId} has been incremented by 1 after the end date.`);
        }
      });

      return { transaction, peakSeasonPrices, remainingStock: room.stock - 1 };
    });
  } catch (error) {
    throw Error;
  }
};
