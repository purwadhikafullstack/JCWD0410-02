import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPropertiesByQuery extends PaginationQueryParams {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  guest?: number;
  title?: string;
  name?: string;
  price?: number;
}

export const getPropertiesServiceByQuery = async (
  query: GetPropertiesByQuery,
) => {
  try {
    const {
      take,
      page,
      sortBy,
      sortOrder,
      search,
      guest,
      title,
      startDate,
      endDate,
      name,
      price,
    } = query;

    const whereClause: Prisma.PropertyWhereInput = {
      isDeleted: false,
      propertycategory: name ? { name: { equals: name } } : undefined,
      rooms: {
        some: {
          guest: guest ? { gte: guest } : undefined,
          stock: { gt: 0 },
          roomNonAvailabilities: {
            none: {
              OR: [
                {
                  startDate: startDate,
                  endDate: endDate,
                },
              ],
            },
          },
        },
      },
    };

    if (title) {
      whereClause.title = { contains: title };
    }

    const propertiesByQuery = await prisma.property.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : {},
      include: {
        propertyImages: { select: { imageUrl: true } },
        reviews: { select: { rating: true } },
        tenant: { select: { name: true } },
        rooms: true,
        propertycategory: true,
        propertyFacilities: true,
      },
    });

    const count = await prisma.property.count({ where: whereClause });

    return {
      data: propertiesByQuery,
      meta: { page, take, total: count },
      whereClause,
    };
  } catch (error) {
    throw error;
  }
};
