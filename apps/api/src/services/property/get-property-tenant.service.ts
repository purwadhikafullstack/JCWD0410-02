import prisma from '@/prisma';

export const getPropertyTenantService = async (id: number) => {
  try {
    const property = await prisma.property.findFirst({
      where: { id, isDeleted: false },
      include: {
        tenant: true,
        rooms: { include: { roomImages: true, roomFacilities: true } },
        propertyImages: true,
        propertyFacilities: true,
        reviews: true,
        propertycategory: true,
      },
    });

    if (!property) {
      throw new Error('Invalid Property id');
    }
    return property;
  } catch (error) {
    throw error;
  }
};
