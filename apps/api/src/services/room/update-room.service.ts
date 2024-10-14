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

    if(body.stock){
      body.stock = Number (body.stock)
    }

    if(body.price){
      body.price= Number (body.price)
    }

    if(body.guest ){
      body.guest  = Number (body.guest )
    }
    delete body.propertyId

    const updatedData = {
      ...body,
  
    };

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const newRoom = await prisma.room.update({
          where: { id },
          data: updatedData,
          
        });

        return {
          message: 'Update room success',
          data: newRoom,
        };
      },
    );
  } catch (error) {
    throw error;
  }
};
