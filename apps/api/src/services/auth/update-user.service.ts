import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { User } from '@prisma/client';

export const updateProfileService = async (
  id: number,
  body: Partial<User>,
  file?: Express.Multer.File,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (body.email && body.email !== user.email) {
      const userEmail = await prisma.user.findFirst({
        where: { email: { equals: body.email } },
      });
      if (userEmail) {
        throw new Error('Email already in use');
      }
    }

    if (file) {
      const { secure_url } = await cloudinaryUpload(file);
      body.imageUrl = secure_url;
    }

    const profileUpdate = await prisma.user.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return {
      message: 'Update profile success',
      data: profileUpdate,
    };
  } catch (error) {
    throw error;
  }
};
