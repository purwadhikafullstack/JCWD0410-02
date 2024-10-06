import prisma from '@/prisma';

export const getRoomService = async (id: number) => {
  try {
    const room = await prisma.room.findFirst({
      where: { id, isDeleted: false },
      include: {
        roomFacilities: true,
        roomImages: true,
        roomNonAvailabilities: true,
        peakSeasonRates: true,
        transactions: true,
        property: true,
      },
    });

    if (!room) {
      throw new Error('Invalid room id');
    }
    return room;
  } catch (error) {
    throw error;
  }
};
