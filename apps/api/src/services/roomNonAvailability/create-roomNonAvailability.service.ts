import prisma from '@/prisma';
import { Prisma, Room } from '@prisma/client';
import { areIntervalsOverlapping } from 'date-fns';

interface CreateRoomNonAvailabilityBody extends Room {
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const createRoomNonAvailabilityService = async (
  userId: number,
  body: CreateRoomNonAvailabilityBody,
) => {
  try {
    const { reason, startDate, endDate, roomId } = body;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const getRoomNonAvailability = await prisma.roomNonAvailability.findMany({
      where: { roomId: roomId },
    });

    const inputDate = { start: new Date(startDate), end: new Date(endDate) };
    getRoomNonAvailability.forEach((item) => {
      const areOverlap = areIntervalsOverlapping(inputDate, {
        start: new Date(item.startDate),
        end: new Date(item.endDate),
      });
      if (areOverlap) {
        throw new Error(
          'Room Non Availability for that interval already exists',
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
        const newRoomNonAvailability = await prisma.roomNonAvailability.create({
          data: {
            reason,
            roomId: roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        });

        return {
          message: 'Create Room Non Availability success',
          data: newRoomNonAvailability,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
