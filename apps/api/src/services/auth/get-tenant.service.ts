import prisma from '@/prisma';

export const getTenantService = async (userId: number) => {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { userId },
    });

    if (!tenant) {
      throw new Error('tenant not found');
    }

    return tenant;
  } catch (error) {
    throw error;
  }
};
