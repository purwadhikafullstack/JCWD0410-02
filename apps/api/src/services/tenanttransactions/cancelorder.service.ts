// services/tenanttransactions/cancelorder.service.ts
import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

// Fungsi untuk membatalkan pesanan oleh tenant
export const cancelOrderService = async (transactionId: number) => {
  try {
    // Cari transaksi berdasarkan ID yang diberikan
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
      include: { user: { select: { name: true, email: true } } }
    });

    // Jika transaksi tidak ditemukan, lempar error
    if (!transaction) {
      throw new Error('Invalid transaction id');
    }

    // Hanya izinkan pembatalan jika bukti pembayaran belum diunggah
    if (transaction.paymentProof) {
      throw new Error('Cannot cancel order, payment proof already uploaded');
    }

    // Perbarui status transaksi menjadi DIBATALKAN
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: StatusTransaction.CANCELLED },
    });

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
