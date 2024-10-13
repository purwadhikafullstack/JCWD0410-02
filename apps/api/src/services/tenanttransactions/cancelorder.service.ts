import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

export const cancelOrderService = async (transactionId: number) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
      include: {
        user: { select: { name: true, email: true } },
        room: { select: { id: true, stock: true } } 
      }
    });

    if (!transaction) {
      throw new Error('Invalid transaction id');
    }

    if (transaction.status !== StatusTransaction.WAITING_FOR_PAYMENT) {
      throw new Error('Cannot cancel order, transaction is not in WAITING_FOR_PAYMENT status');
    }

    if (transaction.paymentProof) {
      throw new Error('Cannot cancel order, payment proof already uploaded');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: StatusTransaction.CANCELLED },
    });

    // Increase room stock by 1
    await prisma.room.update({
      where: { id: transaction.roomId },
      data: { stock: transaction.room.stock + 1 },
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
