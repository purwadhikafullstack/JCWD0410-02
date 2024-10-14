import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';
import { transporter } from '@/lib/nodemailer';  // Pastikan transporter nodemailer sudah disiapkan
import schedule from 'node-schedule';  // Pastikan node-schedule sudah terpasang

export const processOrderService = async (transactionId: number) => {
  try {
    // Mencari transaksi berdasarkan ID dan status
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, status: StatusTransaction.WAITING_FOR_PAYMENT },
      include: {
        user: { select: { name: true, email: true } },
        room: { include: { property: true } },
      },
    });

    // Jika transaksi tidak ditemukan atau sudah diproses
    if (!transaction) {
      throw new Error('Transaction not found or already processed.');
    }

    // Mengubah status transaksi menjadi PROCESSED
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: StatusTransaction.PROCESSED,
      },
    });

    // Mengirimkan bukti pembayaran via email
    await transporter.sendMail({
      to: transaction.user.email,
      subject: 'Payment Confirmation - Your Booking is Processed',
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #56298d;">Payment Confirmed</h2>
          <p>Dear ${transaction.user.name},</p>
          <p>Your payment for the booking has been confirmed. Below are the details:</p>
          <ul>
            <li><strong>Transaction ID:</strong> ${transaction.id}</li>
            <li><strong>Property:</strong> ${transaction.room.property.title}</li>
            <li><strong>Check-in Date:</strong> ${new Date(transaction.startDate).toLocaleDateString()}</li>
            <li><strong>Check-out Date:</strong> ${new Date(transaction.endDate).toLocaleDateString()}</li>
          </ul>
          <p>Thank you for choosing our service.</p>
        </div>
      `,
    });

    // Mengatur pengingat check-in H-1
    const reminderDate = new Date(transaction.startDate);
    reminderDate.setDate(reminderDate.getDate() - 1);  // Reminder satu hari sebelum check-in
    const currentDate = new Date();

    // Jika reminder H-1 sudah terlewat, kirim segera
    if (reminderDate <= currentDate) {
      try {
        await transporter.sendMail({
          to: transaction.user.email,
          subject: 'Reminder - Check-in Tomorrow',
          html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <h2 style="color: #56298d;">Check-in Reminder</h2>
              <p>Dear ${transaction.user.name},</p>
              <p>This is a friendly reminder that your check-in date is tomorrow.</p>
              <ul>
                <li><strong>Property:</strong> ${transaction.room.property.title}</li>
                <li><strong>Check-in Date:</strong> ${new Date(transaction.startDate).toLocaleDateString()}</li>
              </ul>
              <p>We look forward to welcoming you!</p>
            </div>
          `,
        });
      } catch (error) {
        console.error(`Failed to send immediate reminder email for transaction ID: ${transaction.id}`, error);
      }
    } else {
      // Jika reminder belum terlewat, jadwalkan pengiriman email pengingat
      schedule.scheduleJob(reminderDate, async () => {
        console.log(`Sending reminder email for transaction ID: ${transaction.id}`);
        try {
          await transporter.sendMail({
            to: transaction.user.email,
            subject: 'Reminder - Check-in Tomorrow',
            html: `
              <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <h2 style="color: #56298d;">Check-in Reminder</h2>
                <p>Dear ${transaction.user.name},</p>
                <p>This is a friendly reminder that your check-in date is tomorrow.</p>
                <ul>
                  <li><strong>Property:</strong> ${transaction.room.property.title}</li>
                  <li><strong>Check-in Date:</strong> ${new Date(transaction.startDate).toLocaleDateString()}</li>
                </ul>
                <p>We look forward to welcoming you!</p>
              </div>
            `,
          });
        } catch (error) {
          console.error(`Failed to send scheduled reminder email for transaction ID: ${transaction.id}`, error);
        }
      });
    }

    return updatedTransaction;
  } catch (error) {
    console.error('Error in processOrderService:', error);
    throw error;
  }
};
