import prisma from '@/prisma';
import { Prisma, Room } from '@prisma/client';
import { areIntervalsOverlapping } from 'date-fns';

interface UpdatePeakSeasonBody extends Room {
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const updatePeakSeasonRateManagementService = async (
  id: number,
  body: Partial<UpdatePeakSeasonBody>,
) => {
  try {
    const { price, startDate, endDate, roomId } = body;
    const peakSeasonId = await prisma.peakSeasonRate.findUnique({
      where: { id },
    });

    if (!peakSeasonId) {
      throw new Error('Peak Season id not found ');
    }

    const updatePeakSeasonRate = await prisma.peakSeasonRate.update({
      where: { id },
      data: { ...body },
    });

    return {
      message: 'Update Peak Season Rate Success',
      data: updatePeakSeasonRate,
    };
  } catch (error) {
    throw error;
  }
};
