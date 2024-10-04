import prisma from '@/prisma';
import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule';
import { StatusTransaction } from '@prisma/client';

// Unggah bukti pembayaran
export const updatePaymentProof = async (transactionId: number, file: Express.Multer.File) => {
  try {
    // Validasi ekstensi file dan ukuran
    const allowedExtensions = ['.jpg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error('Ekstensi file tidak diperbolehkan. Hanya .jpg dan .png yang diizinkan.');
    }

    if (file.size > 1 * 1024 * 1024) { // 1MB
      throw new Error('Ukuran file terlalu besar. Maksimal ukuran file adalah 1MB.');
    }

    // Simpan file
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', file.filename);
    fs.writeFileSync(uploadPath, file.buffer);

    // Update transaksi dengan bukti pembayaran
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION,
        paymentProof: uploadPath,
      },
    });

    return transaction;
  } catch (error) {
    // Tangani error secara terpusat
    throw new Error('Gagal mengupload bukti pembayaran: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Jadwal pembatalan otomatis jika bukti pembayaran tidak diupload dalam 1 jam
export const schedulePaymentProofTimeout = (transactionId: number) => {
  const cancelTime = new Date(Date.now() + 60 * 60 * 1000);

  // Bungkus seluruh operasi async dengan try-catch untuk menangani kesalahan
  try {
    schedule.scheduleJob(cancelTime, async () => {
      try {
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
        });

        // Jika transaksi masih berstatus WAITING_FOR_PAYMENT, ubah menjadi CANCELLED
        if (transaction && transaction.status === StatusTransaction.WAITING_FOR_PAYMENT) {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: StatusTransaction.CANCELLED },
          });
        }
      } catch (error) {
        // Tangani error yang terjadi saat penjadwalan pembatalan
        console.error('Gagal memperbarui status transaksi:', error);
      }
    });
  } catch (error) {
    console.error('Gagal menjadwalkan pembatalan pembayaran:', error);
  }
};
