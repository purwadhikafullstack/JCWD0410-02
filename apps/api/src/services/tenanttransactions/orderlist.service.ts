import { Prisma, StatusTransaction } from '@prisma/client';
import prisma from '../../prisma';

interface GetTransactionsService {
  page: number;
  take: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
  status?: StatusTransaction;
  tenantIds: number[];
}

export const getTenantIdsByUserId = async (userId: number): Promise<number[]> => {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { userId },
      select: { id: true },
    });

    return tenants.map((tenant) => tenant.id); 
  } catch (error) {
    throw new Error('Failed to retrieve tenant IDs');
  }
};

export const getTransactionsService = async (query: GetTransactionsService) => {
  try {
    const { page, take, sortBy, sortOrder, search, status, tenantIds } = query;

    if (!tenantIds || tenantIds.length === 0) {
      throw new Error('Invalid tenantIds provided');
    }

    const whereClause: Prisma.TransactionWhereInput = {
      room: {
        property: {
          tenantId: {
            in: tenantIds,
          },
          ...(search ? { title: { contains: search } } : {}),
        },
      },
      ...(status ? { status: status } : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      take: take || 10,
      skip: (page - 1) * take || 0,
      orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
      select: {
        id: true,
        roomId:true,
        createdAt: true,
        status: true,
        total: true,
        paymentProof: true,
        startDate: true,
        endDate:true,

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
                title: true,
                propertycategory: { 
                  select: {
                    name: true,
                  },
                },
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const total = await prisma.transaction.count({
      where: whereClause,
    });

    return {
      data: transactions,
      meta: { total, take: take || 10, page: page || 1 },
    };
  } catch (error) {
    throw error;
  }
};
