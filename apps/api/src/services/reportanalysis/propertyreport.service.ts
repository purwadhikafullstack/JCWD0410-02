import prisma from '@/prisma';

interface GetPropertyReportService {
  tenantIds: number[];
  startDate?: Date;
  endDate?: Date;
}

export const getPropertyReportService = async ({
  tenantIds,
  startDate,
  endDate,
}: GetPropertyReportService) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        tenantId: { in: tenantIds },
      },
      select: {
        id: true,
        title: true,
        description: true,
        propertycategory: {
          select: {
            id: true,
            name: true,
          },
        },
        propertyFacilities: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        rooms: {
          select: {
            id: true,
            name: true,
            stock: true,
            price: true,
            roomFacilities: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
            transactions: {
              where: {
                status: 'PROCESSED',
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              select: {
                startDate: true,
                endDate: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return properties.map((property) => ({
      propertyId: property.id,
      propertyName: property.title,
      propertyDescription: property.description,
      propertyCategory: {
        categoryId: property.propertycategory.id,
        categoryName: property.propertycategory.name,
      },
      propertyFacilities: property.propertyFacilities.map((facility) => ({
        facilityId: facility.id,
        facilityTitle: facility.title,
        facilityDescription: facility.description,
      })),
      rooms: property.rooms.map((room) => ({
        roomId: room.id,
        roomName: room.name,
        stock: room.stock,
        price: room.price,
        availability: room.transactions.length > 0 ? 'Non Available' : 'Available',
        soldOutDates: room.transactions.map((transaction) => ({
          startDate: transaction.startDate,
          endDate: transaction.endDate,
          reason: `Booked by ${transaction.user.name}`,
        })),
        roomFacilities: room.roomFacilities.map((facility) => ({
          facilityId: facility.id,
          facilityTitle: facility.title,
          facilityDescription: facility.description,
        })),
      })),
    }));
  } catch (error) {
    throw Error
  }
};
