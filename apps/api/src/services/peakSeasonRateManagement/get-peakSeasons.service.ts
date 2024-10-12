import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPeakSeasonsQuery extends PaginationQueryParams {
  search: string;
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const getPeakSeasonsService = async (
  query: GetPeakSeasonsQuery,
  userId: number,
) => {
  try {
    const {
      take,
      page,
      sortBy,
      sortOrder,
      search,
      price,
      startDate,
      endDate,
      roomId,
    } = query;

    const whereClause: Prisma.PeakSeasonRateWhereInput = {
      isDeleted: false,
      room: { property: { tenantId: userId }, id: roomId ? roomId : undefined },
    };

    const properties = await prisma.peakSeasonRate.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder || 'asc' },
      include: {
        room: true,
      },
    });

    const count = await prisma.peakSeasonRate.count({ where: whereClause });
    return {
      data: properties,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
