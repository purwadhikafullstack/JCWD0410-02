import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPropertiesQuery extends PaginationQueryParams {
  search: string;
  startDate: Date;
  endDate: Date;
  guest: number;
}

export const getPropertiesService = async (query: GetPropertiesQuery) => {
  try {
    const { take, page, sortBy, sortOrder, search, guest, startDate, endDate } =
      query;

    const whereClause: Prisma.PropertyWhereInput = {
      isDeleted: false,
    };

    const properties = await prisma.property.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder || 'asc' },
      include: {
        propertyImages: { select: { imageUrl: true } },
        reviews: { select: { rating: true } },
        tenant: { select: { name: true } },
        rooms: { select: { price: true } },
      },
    });

    const count = await prisma.property.count({ where: whereClause });
    return { data: properties, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
