import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';
import schedule from 'node-schedule';

interface CreateTransactionBody {
  roomId: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export const createTransactionService = async (body: CreateTransactionBody) => {
  const { roomId, startDate, endDate, userId } = body;

  try {
    return await prisma.$transaction(async (prismaTransaction) => {
      console.log(`Checking RoomNonAvailability for roomId ${roomId}`);
      const nonAvailableDates = await prismaTransaction.roomNonAvailability.findFirst({
        where: {
          roomId,
          isDeleted: false,
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } },
          ],
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
          AND: [
            { startDate: { lt: endDate } },
            { endDate: { gt: startDate } },
          ],
        },
      });

      if (overlappingTransactions.length > 0) {
        console.log(`Room is not available due to overlapping transactions: ${overlappingTransactions}`);
        throw new Error('Room is not available on the selected dates. Another transaction is pending.');
      }

      const room = await prismaTransaction.room.findUnique({
        where: { id: roomId, isDeleted: false },
      });

      if (!room) {
        console.log(`Room not found with roomId ${roomId}`);
        throw new Error('Room not found');
      }

      let remainingStock = room.stock;
      if (remainingStock <= 0) {
        throw new Error('Room is not available on the selected dates.');
      }

      let totalAmount = 0;
      let currentDate = new Date(startDate);
      let peakSeasonPrices: { date: string; price: number }[] = [];


      while (currentDate < endDate) {
        console.log(`Checking rate for currentDate: ${currentDate}`);
        let dayEnd = new Date(currentDate);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const peakSeasonRate = await prismaTransaction.peakSeasonRate.findFirst({
          where: {
            roomId,
            isDeleted: false,
            AND: [
              { startDate: { lte: currentDate } },
              { endDate: { gte: currentDate } },
            ],
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


      const transaction = await prismaTransaction.transaction.create({
        data: {
          roomId,
          userId,
          total: totalAmount,
          startDate,
          endDate,
          status: StatusTransaction.WAITING_FOR_PAYMENT,
        },
      });


     
      await prismaTransaction.room.update({
        where: { id: roomId },
        data: { stock: { decrement: 1 } },
      });

      remainingStock -= 1; 

     
      schedule.scheduleJob(Date.now() +  60 * 1000, async () => {
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


      return { transaction, peakSeasonPrices, remainingStock };
    });
  } catch (error) {
    throw Error;
  }
};
