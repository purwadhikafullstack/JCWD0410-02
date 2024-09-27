import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPropertyQuery extends PaginationQueryParams {
  search: string;
}

export const getPropertyService = async (query: GetPropertyQuery) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.PropertyWhereInput = {};

    if (search) {
      whereClause.title = {
        contains: search,
      };
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
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
