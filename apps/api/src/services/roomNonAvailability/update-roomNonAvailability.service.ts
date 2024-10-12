import prisma from '@/prisma';
import { Prisma, Room } from '@prisma/client';
import { areIntervalsOverlapping } from 'date-fns';

interface UpdateRoomNonAvailabilitiyBody extends Room {
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const updateRoomNonAvailabilitiyService = async (
  id: number,
  body: Partial<UpdateRoomNonAvailabilitiyBody>,
) => {
  try {
    const { reason, startDate, endDate, roomId } = body;
    const roomNonAvailabilityId = await prisma.roomNonAvailability.findUnique({
      where: { id },
    });

    if (!roomNonAvailabilityId) {
      throw new Error('Room Non availability id not found');
    }

    const updatePeakSeasonRate = await prisma.roomNonAvailability.update({
      where: { id },
      data: { ...body },
    });

    return {
      message: 'Update Room Non Availability Success',
      data: updatePeakSeasonRate,
    };
  } catch (error) {
    throw error;
  }
};
