import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';
import { transporter } from '@/lib/nodemailer';

// Fungsi untuk konfirmasi atau tolak pembayaran
export const confirmPaymentService = async (
  transactionId: number,
  confirm: boolean, // true untuk konfirmasi, false untuk tolak
) => {
  try {
    // Mencari transaksi berdasarkan ID yang diberikan
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
      include: {
        user: { select: { name: true, email: true } },
        room: { include: { property: true } },
      },
    });

    // Jika transaksi tidak ditemukan, lempar error
    if (!transaction) {
      throw new Error('Invalid transaction id');
    }

    // Tentukan status berdasarkan tindakan (confirm atau tolak)
    const newStatus = confirm
      ? StatusTransaction.PROCESSED
      : StatusTransaction.WAITING_FOR_PAYMENT;

    // Update status transaksi
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: newStatus },
    });

    // Jika pembayaran dikonfirmasi, kirim email dengan detail pemesanan
    if (confirm) {
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
            <p>Terms and Conditions for staying at the property:</p>
            <ul>
              <li>No smoking in the room</li>
              <li>Please check-in at the front desk upon arrival</li>
              <li>Check-out time is 12:00 PM</li>
            </ul>
            <p>Thank you for choosing our service.</p>
            <p>Best regards,<br/>Property Management Team</p>
          </div>
        `,
      });

      // Mengatur pengingat H-1
      const reminderDate = new Date(transaction.startDate);
      reminderDate.setDate(reminderDate.getDate() - 1);

      setTimeout(async () => {
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
              <p>Best regards,<br/>Property Management Team</p>
            </div>
          `,
        });
      }, reminderDate.getTime() - new Date().getTime()); // Menghitung jarak waktu untuk pengiriman email H-1
    }

    return updatedTransaction;
  } catch (error) {
    throw error;
  }
};
