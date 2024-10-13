import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetRoomsQuery extends PaginationQueryParams {
  search: string;
}

export const getRoomsService = async (query: GetRoomsQuery) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.RoomWhereInput = {
      isDeleted: false,
    };

    if (search) {
      whereClause.name = {
        contains: search,
      };
    }

    const properties = await prisma.room.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder || 'asc' },
      include: {
        roomFacilities: true,
        roomImages: true,
        roomNonAvailabilities: true,
        peakSeasonRates: true,
        transactions: true,
        property: true,
      },
    });

    const count = await prisma.room.count({ where: whereClause });
    return { data: properties, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
