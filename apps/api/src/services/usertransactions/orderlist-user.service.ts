import { Prisma } from '@prisma/client';
import prisma from '../../prisma';

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

// Fungsi untuk mendapatkan daftar transaksi berdasarkan userId dan filter pencarian
export const getUserTransactionsService = async (query: GetUserTransactionsService) => {
  try {
    const { userId, page, take, sortBy, sortOrder, search, dateFrom, dateTo, uuid } = query;

    // Membuat where clause berdasarkan filter pencarian
    const whereClause: Prisma.TransactionWhereInput = {
      userId, // Hanya transaksi milik user ini
      ...(uuid ? { uuid: { contains: uuid } } : {}), // Filter berdasarkan UUID (nomor order)
      ...(dateFrom && dateTo ? { createdAt: { gte: dateFrom, lte: dateTo } } : {}), // Filter berdasarkan rentang tanggal
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

    // Hitung total transaksi untuk pagination
    const total = await prisma.transaction.count({
      where: whereClause,
    });

    // Mengembalikan hasil dan metadata untuk paginasi
    return {
      data: transactions,
      meta: { total, take, page },
    };
  } catch (error) {
    throw error;
  }
};
