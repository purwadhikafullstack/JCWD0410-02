import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client'; 

interface GetRoomDetailsService {
  roomId: number;
  startDate: Date;
  endDate: Date;
}

export const getRoomDetailsService = async (query: GetRoomDetailsService) => {
  const { roomId, startDate, endDate, } = query;

  try {
    const nonAvailableDates = await prisma.roomNonAvailability.findFirst({
      where: {
        roomId,
        isDeleted: false,
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });

    if (nonAvailableDates) {
      return {
        isAvailable: false,
        reason: 'Room is nonavailable due to nonavailability dates',
        totalAmount: 0,
        peakSeasonPrices: [],
        remainingStock: 0,
      };
    }

    const overlappingTransactions = await prisma.transaction.findMany({
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
      return {
        isAvailable: false,
        reason: 'Room is nonavailable due to overlapping transactions',
        totalAmount: 0,
        peakSeasonPrices: [],
        remainingStock: 0,
      };
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId, isDeleted: false },
      select: { price: true, stock: true },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    let totalAmount = 0;
    let currentDate = new Date(startDate);
    let peakSeasonPrices: { date: string; price: number }[] = [];

    while (currentDate < endDate) {
      const dayEnd = new Date(currentDate);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const peakSeasonRate = await prisma.peakSeasonRate.findFirst({
        where: {
          roomId,
          isDeleted: false,
          AND: [{ startDate: { lte: currentDate } }, { endDate: { gte: currentDate } }],
        },
      });

      if (peakSeasonRate) {
        totalAmount += peakSeasonRate.price;
        peakSeasonPrices.push({
          date: currentDate.toISOString().split('T')[0],
          price: peakSeasonRate.price,
        });
      } else {
        totalAmount += room.price;
      }

      currentDate = dayEnd;
    }

    return {
      isAvailable: true,
      totalAmount,
      peakSeasonPrices,
      remainingStock: room.stock,
    };
  } catch (error) {
    throw error;
  }
};
