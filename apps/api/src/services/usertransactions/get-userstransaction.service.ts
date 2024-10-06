import prisma from '../../prisma';

interface GetUserTransactionService {
  userId: number;
  transactionId: number;
}

export const getUserTransactionService = async ({ userId, transactionId }: GetUserTransactionService) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true, 
          },
        },
        room: {
          select: {
            stock: true, 
            property: {
              select: {
                tenant: {
                  select: {
                    bankName: true, 
                    bankNumber: true, 
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found or does not belong to the current user');
    }

    return {
      buyerName: transaction.user.name,
      bankName: transaction.room.property.tenant.bankName, 
      bankNumber: transaction.room.property.tenant.bankNumber, 
      totalAmount: transaction.total, 
      createdAt: transaction.createdAt,
      remainingStock: transaction.room.stock, 
    };
  } catch (error) {
    throw error;
  }
};
