import { Prisma, StatusTransaction } from '@prisma/client'; 
import prisma from '../../prisma';

interface GetSalesReportService {
  tenantIds: number[];
  propertyId?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy: string;
  sortOrder: string;
}

export const getSalesReportService = async (query: GetSalesReportService) => {
  const { tenantIds, propertyId, startDate, endDate, sortBy, sortOrder } = query;

  const validSortFields = ['total', 'createdAt', 'updatedAt'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';

  let adjustedEndDate: Date | undefined = endDate;
  if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
    adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999); 
  }

  try {
    const whereClause: Prisma.TransactionWhereInput = {
      status: StatusTransaction.PROCESSED, 
      room: {
        property: {
          tenantId: { in: tenantIds },
          ...(propertyId ? { id: propertyId } : {}),
        },
      },
      ...(startDate && adjustedEndDate
        ? {
            createdAt: {
              gte: startDate,
              lte: adjustedEndDate,
            },
          }
        : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { [sortField]: order },
      select: {
        id: true,
        total: true,
        createdAt: true,
        room: {
          select: {
            name: true,
            property: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    const salesReport = transactions.reduce((acc: any, transaction) => {
      const propertyTitle = transaction.room.property.title;

      if (!acc[propertyTitle]) {
        acc[propertyTitle] = {
          property: propertyTitle,
          totalSales: 0,
          transactions: 0,
        };
      }

      acc[propertyTitle].totalSales += transaction.total;
      acc[propertyTitle].transactions += 1;

      return acc;
    }, {});

    return Object.values(salesReport);
  } catch (error) {
    throw new Error("Failed to retrieve sales report");
  }
};
