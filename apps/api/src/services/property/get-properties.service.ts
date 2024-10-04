import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPropertiesQuery extends PaginationQueryParams {
  search: string;
}

export const getPropertiesService = async (query: GetPropertiesQuery) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.PropertyWhereInput = { isDeleted: false };

    if (search) {
      whereClause.title = {
        contains: search,
      };
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder || 'asc' },
      include: {
        propertyImages: true,
        reviews: true,
        tenant: true,
        rooms: true,
        propertycategory: true,
      },
    });

    const count = await prisma.property.count({ where: whereClause });
    return { data: properties, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
