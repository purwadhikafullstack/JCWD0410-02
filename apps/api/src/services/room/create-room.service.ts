import { cloudinaryUpload } from '@/lib/cloudinary';
import prisma from '@/prisma';
import { Prisma, Property } from '@prisma/client';

interface CreateRoomBody extends Property {
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  title: string;
  description: string;
}

export const createRoomService = async (
  body: CreateRoomBody,
  file: Express.Multer.File,
  tenantId: number,
) => {
  try {
    const { name, stock, price, guest, propertyId, title, description } = body;

    const propertyIdNoNaN = Number(propertyId);
    const stockRoom = Number(stock);
    const priceRoom = Number(price);
    const guestRoom = Number(guest);

    const isPropertyId = await prisma.property.findFirst({
      where: { id: propertyIdNoNaN },
    });

    if (!isPropertyId) {
      throw new Error('Property id not found');
    }

    const { secure_url } = await cloudinaryUpload(file);

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const newRoom = await prisma.room.create({
          data: {
            name,
            stock: stockRoom,
            price: priceRoom,
            guest: guestRoom,
            property: {
              connect: { id: Number(propertyId) },
            },
          },
        });

        if (file) {
          await prisma.roomImage.create({
            data: {
              imageUrl: secure_url,
              roomId: newRoom.id,
            },
          });
        }

        await prisma.roomFacility.create({
          data: { title, description, roomId: newRoom.id },
        });

        return {
          message: 'Create Room success',
          data: newRoom,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
