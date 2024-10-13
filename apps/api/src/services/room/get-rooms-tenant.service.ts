import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetRoomsQuery extends PaginationQueryParams {
  search: string;
}

export const getRoomsTenantService = async (
  query: GetRoomsQuery,
  userId: number,
) => {
  try {
    const { take, page, sortBy, sortOrder, search } = query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    const whereClause: Prisma.RoomWhereInput = {
      isDeleted: false,
      property: { tenantId: tenant.id },
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
