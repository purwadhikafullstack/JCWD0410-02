import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

export const updateTransactionStatusService = async (orderId: string, status: string) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        uuid: orderId, 
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    let newStatus: StatusTransaction;

    switch (status) {
      case 'capture':
      case 'settlement': 
        newStatus = StatusTransaction.PROCESSED;
        break;
      case 'pending': 
        newStatus = StatusTransaction.WAITING_FOR_PAYMENT;
        break;
      case 'deny':
      case 'cancel':
      case 'expire': 
        newStatus = StatusTransaction.CANCELLED;
        break;
      default:
        newStatus = transaction.status; 
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: newStatus },
    });

    return updatedTransaction;
  } catch (error) {
    console.error('Error in updateTransactionStatusService:', error);
    throw error;
  }
};
