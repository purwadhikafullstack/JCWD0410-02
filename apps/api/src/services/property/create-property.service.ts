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
  userId: number,
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

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
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
              connect: { id: tenant.id },
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
