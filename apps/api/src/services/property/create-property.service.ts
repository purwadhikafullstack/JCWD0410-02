import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { Prisma, PropertyCategory } from '@prisma/client';

interface CreatePropertyBody extends PropertyCategory {
  title: string;
  slug: string;
  description: string;
  latitude: string;
  longitude: string;
  propertyCategoryId: string;
}

export const createPropertyService = async (
  body: CreatePropertyBody,
  file: Express.Multer.File,
  tenantId: number,
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

    const property = await prisma.property.findFirst({
      where: { slug },
    });

    if (property) {
      throw new Error('Slug already exist');
    }

    const { secure_url } = await cloudinaryUpload(file);

    const propertycategoryIdNoNaN = Number(propertyCategoryId);

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const newProperty = await prisma.property.create({
          data: {
            description,
            latitude,
            longitude,
            slug,
            title,
            status: 'PUBLISHED',
            propertycategory: {
              connect: { id: propertycategoryIdNoNaN },
            },
            tenant: {
              connect: { id: tenantId },
            },
          },
        });

        if (!propertycategoryIdNoNaN || isNaN(propertycategoryIdNoNaN)) {
          throw new Error('Invalid propertyCategoryId');
        }

        if (file) {
          await prisma.propertyImage.create({
            data: {
              imageUrl: secure_url,
              propertyId: newProperty.id,
            },
          });
        }

        return {
          message: 'Create property success',
          data: newProperty,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
