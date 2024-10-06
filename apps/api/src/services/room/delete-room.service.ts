import prisma from '@/prisma';

export const deleteRoomService = async (id: number, userId: number) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    await prisma.roomFacility.updateMany({
      where: { roomId: id },
      data: { isDeleted: true },
    });

    await prisma.roomImage.updateMany({
      where: { roomId: id },
      data: { isDeleted: true },
    });

    await prisma.roomNonAvailability.updateMany({
      where: { roomId: id },
      data: { isDeleted: true },
    });

    await prisma.peakSeasonRate.updateMany({
      where: { roomId: id },
      data: { isDeleted: true },
    });

    await prisma.room.update({
      where: { id },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw error;
  }
};
