import prisma from '@/prisma';
import { Prisma, Room } from '@prisma/client';
import { areIntervalsOverlapping } from 'date-fns';

interface CreatePeakSeasonBody extends Room {
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const createPeakSeasonRateManagementService = async (
  userId: number,
  body: CreatePeakSeasonBody,
) => {
  try {
    const { price, startDate, endDate, roomId } = body;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const getPeakSeason = await prisma.peakSeasonRate.findMany({
      where: { roomId: roomId },
    });

    const inputDate = { start: new Date(startDate), end: new Date(endDate) };
    getPeakSeason.forEach((item) => {
      const areOverlap = areIntervalsOverlapping(inputDate, {
        start: new Date(item.startDate),
        end: new Date(item.endDate),
      });
      if (areOverlap) {
        throw new Error(
          'Peak Season Rate or Price for that interval already exists',
        );
      }
    });

    const room = await prisma.room.findFirst({
      where: { id: roomId },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const newPeakSeason = await prisma.peakSeasonRate.create({
          data: {
            roomId: roomId,
            price: price,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        });

        return {
          message: 'Create Peak Season Rate success',
          data: newPeakSeason,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
