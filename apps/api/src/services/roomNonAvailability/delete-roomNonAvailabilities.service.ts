import prisma from '@/prisma';

export const deleteRoomNonAvailabilityService = async (id: number) => {
  try {
    const roomNonAvailabilityId = await prisma.roomNonAvailability.findUnique({
      where: { id },
    });

    if (!roomNonAvailabilityId) {
      throw new Error('Room Non availability id not found');
    }

    const deleteRoomNonAvailability = await prisma.roomNonAvailability.delete({
      where: { id },
    });

    return {
      message: 'Delete Room Non Availability Success',
      data: deleteRoomNonAvailability,
    };
  } catch (error) {
    throw error;
  }
};
