import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { Prisma, PropertyCategory } from '@prisma/client';

interface UpdatePropertyBody extends PropertyCategory {
  title: string;
  slug: string;
  description: string;
  latitude: string;
  longitude: string;
  propertyCategoryId: string;
}

export const updatePropertyService = async (
  tenantId: number,
  propertyId: number,
  body: Partial<UpdatePropertyBody>,
  file?: Express.Multer.File,
) => {
  try {
    const {
      description,
      latitude,
      longitude,
      slug,
      title,
      propertyCategoryId,
    } = body;

    const currentProperty = await prisma.property.findUnique({
      where: { id: propertyId, tenantId: tenantId },
    });

    if (!currentProperty) {
      throw new Error('property not found');
    }

    let secureUrl: string | undefined;

    if (file) {
      const { secure_url } = await cloudinaryUpload(file);
      secureUrl = secure_url;
    }

    const propertycategoryIdNoNaN = Number(propertyCategoryId);

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const updateProperty = await prisma.property.update({
          where: { id: propertyId },
          data: {
            description,
            latitude,
            longitude,
            slug,
            title,
            propertyCategoryId: propertycategoryIdNoNaN,
          },
        });

        if (!propertycategoryIdNoNaN || isNaN(propertycategoryIdNoNaN)) {
          throw new Error('Invalid propertyCategoryId');
        }

        if (file && secureUrl) {
          await prisma.propertyImage.update({
            where: { id: propertyId },
            data: {
              imageUrl: secureUrl,
              propertyId: updateProperty.id,
            },
          });
        }

        return {
          message: 'Update property success',
          data: updateProperty,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
