import { JWT_SECRET } from '@/config';
import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { Tenant } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const updateTenantService = async (
  tenantId: number,
  userId: number,
  body: Partial<Tenant>,
  file?: Express.Multer.File,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    if (file) {
      const { secure_url } = await cloudinaryUpload(file);
      body.imageUrl = secure_url;
    }

    if (body.bankNumber) {
      body.bankNumber = Number(body.bankNumber);
    }

    const tenantUpdate = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...body,
      },
    });

    const token = sign({ id: user.id }, JWT_SECRET!, {
      expiresIn: '2h',
    });

    return {
      message: 'Update tenant success',
      data: { ...tenantUpdate, token },
    };
  } catch (error) {
    throw error;
  }
};
