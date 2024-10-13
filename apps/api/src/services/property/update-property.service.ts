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
  userId: number,
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'TENANT') {
      throw new Error("User don't have access");
    }

    const tenant = await prisma.tenant.findFirst({
      where: { userId: user.id, isDeleted: false },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const currentProperty = await prisma.property.findUnique({
      where: { id: propertyId, tenantId: tenant.id },
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
