import { Prisma, StatusTransaction } from '@prisma/client';
import prisma from '../../prisma';

interface GetTransactionsService {
  page: number;
  take: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
  status?: StatusTransaction;
  tenantId: number;
}

// Fungsi untuk mendapatkan tenantId berdasarkan userId
export const getTenantIdByUserId = async (userId: number): Promise<number | null> => {
  try {
    // Menggunakan findFirst karena userId tidak unik di tenant
    const tenant = await prisma.tenant.findFirst({
      where: { userId },
      select: { id: true },
    });

    return tenant ? tenant.id : null;
  } catch (error) {
    throw new Error("Failed to retrieve tenant ID");
  }
};

// Fungsi untuk mendapatkan daftar transaksi berdasarkan tenantId
export const getTransactionsService = async (query: GetTransactionsService) => {
  try {
    const { page, take, sortBy, sortOrder, search, status, tenantId } = query;

    // Validasi tenantId
    if (!tenantId || isNaN(tenantId)) {
      throw new Error("Invalid tenantId provided");
    }

    // Membuat where clause berdasarkan tenantId, status, dan search
    const whereClause: Prisma.TransactionWhereInput = {
      room: {
        property: {
          tenantId: tenantId,
          ...(search ? {
            title: {
              contains: search,
            },
          } : {}),
        },
      },
      ...(status ? { status: status } : {}),
    };

    // Query transaksi berdasarkan filter dan paginasi
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
          include: {
            property: {
              select: {
                title: true,
                category: true,
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

    // Hitung total transaksi
    const total = await prisma.transaction.count({
      where: whereClause,
    });

    // Mengembalikan hasil dan metadata
    return {
      data: transactions,
      meta: { total, take, page },
    };
  } catch (error) {
    throw error;
  }
};
