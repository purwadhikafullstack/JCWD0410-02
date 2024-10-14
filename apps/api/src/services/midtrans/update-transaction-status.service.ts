import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

export const updateTransactionStatusService = async (orderId: string, status: string) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        uuid: orderId, // Order ID dari Midtrans biasanya berbasis UUID
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    let newStatus: StatusTransaction;

    // Mapping status dari Midtrans ke status transaksi internal
    switch (status) {
      case 'capture':
      case 'settlement': // Pembayaran sukses
        newStatus = StatusTransaction.PROCESSED;
        break;
      case 'pending': // Menunggu pembayaran
        newStatus = StatusTransaction.WAITING_FOR_PAYMENT;
        break;
      case 'deny':
      case 'cancel':
      case 'expire': // Pembayaran gagal atau dibatalkan
        newStatus = StatusTransaction.CANCELLED;
        break;
      default:
        newStatus = transaction.status; // Jika status tidak dikenali, tetap dengan status sebelumnya
    }

    // Update status transaksi
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
