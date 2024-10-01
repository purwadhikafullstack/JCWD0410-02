import prisma from '@/prisma';

export const getPropertyService = async (slug: string) => {
  try {
    const property = await prisma.property.findFirst({
      where: { slug },
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
      throw new Error('Invalid Property Slug');
    }
    return property;
  } catch (error) {
    throw error;
  }
};
