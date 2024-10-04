import prisma from '@/prisma';

export const deletePropertyService = async (id: number, userId: number) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const rooms = await prisma.room.findMany({
      where: { propertyId: id },
      select: { id: true },
    });

    const roomIds = rooms.map((room) => room.id);

    await prisma.roomFacility.updateMany({
      where: { roomId: { in: roomIds } },
      data: { isDeleted: true },
    });

    await prisma.roomImage.updateMany({
      where: { roomId: { in: roomIds } },
      data: { isDeleted: true },
    });

    await prisma.roomNonAvailability.updateMany({
      where: { roomId: { in: roomIds } },
      data: { isDeleted: true },
    });

    await prisma.peakSeasonRate.updateMany({
      where: { roomId: { in: roomIds } },
      data: { isDeleted: true },
    });

    await prisma.room.updateMany({
      where: { propertyId: id },
      data: { isDeleted: true },
    });

    await prisma.propertyFacility.updateMany({
      where: { propertyId: id },
      data: { isDeleted: true },
    });

    await prisma.propertyImage.updateMany({
      where: { propertyId: id },
      data: { isDeleted: true },
    });

    await prisma.property.update({
      where: { id },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw error;
  }
};
