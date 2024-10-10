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

    const whereClause: Prisma.RoomNonAvailabilityWhereInput = {
      isDeleted: false,
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
