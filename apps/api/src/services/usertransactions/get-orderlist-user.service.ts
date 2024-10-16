import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

interface GetUserTransactionsService {
  userId: number;
  page: number;
  take: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  uuid?: string;
}

export const getUserOrderListService = async (query: GetUserTransactionsService) => {
  try {
    const { userId, page, take, sortBy, sortOrder, search, dateFrom, dateTo, uuid } = query;

    const whereClause: Prisma.TransactionWhereInput = {
      userId, 
      ...(uuid ? { uuid: { contains: uuid } } : {}), 
      ...(dateFrom && dateTo ? { createdAt: { gte: dateFrom, lte: dateTo } } : {}), 
      ...(search ? {
        room: {
          property: {
            title: {
              contains: search,
            },
          },
        },
      } : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        room: {
          select: {
            name: true,
            property: {
              select: {
                id: true,  
                title: true,
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        reviews: {
          where: {
            transaction: {
              status: 'PROCESSED', 
            },
          },
          select: {
            rating: true,
            review: true,
            createdAt: true,
          },
        },
      },
    });

    const total = await prisma.transaction.count({
      where: whereClause,
    });

    return {
      data: transactions,
      meta: { total, take, page },
    };
  } catch (error) {
    throw error;
  }
};
