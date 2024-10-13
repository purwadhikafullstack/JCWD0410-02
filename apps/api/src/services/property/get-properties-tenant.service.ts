import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetPropertiesQuery extends PaginationQueryParams {
  search: string;
}

export const getTenantPropertiesService = async (
  query: GetPropertiesQuery,
  UserId: number,
) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const user = await prisma.user.findUnique({
      where: { id: UserId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'TENANT') {
      throw new Error("User don't have access");
    }

    const tenant = await prisma.tenant.findFirst({
      where: { userId: user.id, isDeleted: false },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const whereClause: Prisma.PropertyWhereInput = {
      isDeleted: false,
      tenantId: tenant.id,
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
