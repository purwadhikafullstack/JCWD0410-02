import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination';
import { Prisma } from '@prisma/client';

interface GetRoomNonAvailabilitiesQuery extends PaginationQueryParams {
  search: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const getRoomNonAvailabilitiesService = async (
  query: GetRoomNonAvailabilitiesQuery,
  userId: number,
) => {
  try {
    const {
      take,
      page,
      sortBy,
      sortOrder,
      search,
      reason,
      startDate,
      endDate,
      roomId,
    } = query;

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

    const whereClause: Prisma.RoomNonAvailabilityWhereInput = {
      isDeleted: false,
      room: { property: { tenantId: tenant.id } },
    };

    const roomNonAvailabilities = await prisma.roomNonAvailability.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder || 'asc' },
      include: {
        room: true,
      },
    });

    const count = await prisma.roomNonAvailability.count({
      where: whereClause,
    });
    return { data: roomNonAvailabilities, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
