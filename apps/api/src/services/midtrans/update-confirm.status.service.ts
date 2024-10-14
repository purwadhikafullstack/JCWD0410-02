import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

export const processOrderService = async (transactionId: number) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, status: StatusTransaction.WAITING_FOR_PAYMENT },
    });

    if (!transaction) {
      throw new Error('Transaction not found or already processed.');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: StatusTransaction.PROCESSED,
      },
    });

    return updatedTransaction;
  } catch (error) {
    console.error('Error in processOrderService:', error);
    throw error;
  }
};
