import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

const isDateInRange = (
  start: Date,
  end: Date,
  checkStart: Date,
  checkEnd: Date,
) => {
  return (
    (checkStart >= start && checkStart <= end) ||
    (checkEnd >= start && checkEnd <= end)
  );
};

export const getValidBookingDatesAndPrices = async (
  slug: string,
  startDate: Date,
  endDate: Date,
) => {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        rooms: {
          include: {
            transactions: true,
            roomNonAvailabilities: true,
            peakSeasonRates: true,
          }
        }
      }
    });

    if (!property || property.rooms.length === 0) {
      throw new Error('Room not found');
    }

    const room = property.rooms[0]; // Assuming one room per property, adjust if needed

    for (const transaction of room.transactions) {
      if (
        isDateInRange(
          transaction.startDate,
          transaction.endDate,
          startDate,
          endDate,
        )
      ) {
        throw new Error('Tanggal yang dipilih sudah dibooking oleh orang lain.');
      }
    }

    for (const nonAvailability of room.roomNonAvailabilities) {
      if (
        isDateInRange(
          nonAvailability.startDate,
          nonAvailability.endDate,
          startDate,
          endDate,
        )
      ) {
        throw new Error('Tanggal yang dipilih berada dalam periode non-availability.');
      }
    }

    let totalPrice = 0;
    let peakRatePrice = room.price;
    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.round(
      (endDate.getTime() - startDate.getTime()) / oneDay,
    );

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      for (const peakSeason of room.peakSeasonRates) {
        if (
          currentDate >= peakSeason.startDate &&
          currentDate <= peakSeason.endDate
        ) {
          peakRatePrice = peakSeason.price;
        }
      }
      totalPrice += peakRatePrice;
    }

    return { isValid: true, totalPrice, room };
  } catch (error) {
    throw Error
  }
};

export const createBookingTransaction = async (
  slug: string,
  startDate: Date,
  endDate: Date,
  userId: number,  // userId passed from res.locals.user
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { isValid, totalPrice, room } = await getValidBookingDatesAndPrices(
        slug,
        startDate,
        endDate,
      );

      if (!isValid) {
        throw new Error('Tanggal booking tidak valid.');
      }

      const transaction = await tx.transaction.create({
        data: {
          userId,  // Using userId from res.locals.user
          roomId: room.id,
          status: StatusTransaction.WAITING_FOR_PAYMENT,
          total: totalPrice,
          startDate,
          endDate,
        },
      });

      await tx.room.update({
        where: { id: room.id },
        data: {
          stock: { decrement: 1 },
        },
      });

      return transaction;
    });
  } catch (error) {
    throw Error
  }
};
