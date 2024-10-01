import prisma from '@/prisma';
import { PropertyCategory } from '@prisma/client';

export const createCategoryService = async (
  body: PropertyCategory,
  userId: number,
) => {
  try {
    const { name } = body;

    if (!userId) {
      throw new Error(`User ${userId} not found`);
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        tenants: { select: { userId: true } },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'TENANT') {
      throw new Error("User don't have access");
    }

    const existingCategory = await prisma.propertyCategory.findFirst({
      where: { name },
    });

    if (existingCategory) {
      throw new Error('Category already exist');
    }

    const newCategory = await prisma.propertyCategory.create({
      data: {
        ...body,
        tenantId: user.tenants[0]?.userId,
      },
    });

    return {
      message: 'Create property category success',
      data: newCategory,
    };
  } catch (error) {
    throw error;
  }
};
