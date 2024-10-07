import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

export const cancelTransactionService = async (userId: number, transactionId: number) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        status: StatusTransaction.WAITING_FOR_PAYMENT,
      },
    });

    if (!transaction) {
      throw new Error('Transaction cannot be cancelled');
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: StatusTransaction.CANCELLED },
    });

    await prisma.room.update({
      where: { id: transaction.roomId },
      data: { stock: { increment: 1 } },  
    });

    return { message: 'Transaction successfully cancelled and room stock incremented' };
  } catch (error) {
    throw error;
  }
};
