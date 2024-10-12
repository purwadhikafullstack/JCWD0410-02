import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { Prisma, Property } from '@prisma/client';

interface UpdateRoomBody extends Property {
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
}

export const updateRoomService = async (
  id: number,
  body: Partial<UpdateRoomBody>,
  file?: Express.Multer.File,
) => {
  try {
    const { name, stock, price, guest, propertyId } = body;

    const stockRoom = Number(stock);
    const priceRoom = Number(price);
    const guestRoom = Number(guest);

    const isRoomId = await prisma.room.findUnique({
      where: { id },
    });

    if (!isRoomId) {
      throw new Error('room id not found');
    }

    let secureUrl: string | undefined;

    if (file) {
      const { secure_url } = await cloudinaryUpload(file);
      secureUrl = secure_url;
    }

    const updatedData = {
      ...body,
      ...(body.stock && { stock: Number(body.stock) }),
      ...(body.price && { price: Number(body.price) }),
      ...(body.guest && { guest: Number(body.guest) }),
      ...(body.propertyId && { propertyId: Number(body.propertyId) }),
    };

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const newRoom = await prisma.room.update({
          where: { id },
          data: updatedData,
        });

        if (file && secureUrl) {
          const existingRoomImage = await prisma.roomImage.findFirst({
            where: { roomId: newRoom.id },
          });
          if (existingRoomImage) {
            await prisma.roomImage.update({
              where: { id: existingRoomImage.id },
              data: {
                imageUrl: secureUrl,
              },
            });
          }
        }

        return {
          message: 'Update property success',
          data: newRoom,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
