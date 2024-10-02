import prisma from '@/prisma';

interface GetPropertyReportService {
  tenantIds: number[];
  startDate?: Date;
  endDate?: Date;
}

export const getPropertyReportService = async (query: GetPropertyReportService) => {
  const { tenantIds, startDate, endDate } = query;

  try {
    const properties = await prisma.property.findMany({
      where: {
        tenantId: { in: tenantIds },
      },
      select: {
        id: true,
        title: true,
        rooms: {
          select: {
            id: true,
            name: true,
            roomNonAvailabilities: {
              where: {
                OR: [
                  { startDate: { gte: startDate } },
                  { endDate: { lte: endDate } },
                ],
              },
              select: {
                startDate: true,
                endDate: true,
                reason: true,
              },
            },
          },
        },
      },
    });

    const propertyReport = properties.map(property => ({
      propertyId: property.id,
      propertyName: property.title,
      rooms: property.rooms.map(room => ({
        roomId: room.id,
        roomName: room.name,
        availability: room.roomNonAvailabilities.map(nonAvailable => ({
          startDate: nonAvailable.startDate,
          endDate: nonAvailable.endDate,
          reason: nonAvailable.reason || 'Not available',
        })),
      })),
    }));

    return propertyReport;
  } catch (error) {
    throw new Error("Failed to retrieve property report");
  }
};
