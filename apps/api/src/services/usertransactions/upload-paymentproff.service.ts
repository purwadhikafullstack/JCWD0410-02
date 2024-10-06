import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';
import schedule from 'node-schedule';

export const uploadPaymentProofService = async (
  userId: number,
  transactionId: number,
  file: Express.Multer.File,
) => {
  try {

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        status: StatusTransaction.WAITING_FOR_PAYMENT,
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found or not valid for payment');
    }

    const paymentProofPath = `/uploads/${file.originalname}`;

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: paymentProofPath,
        status: StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION,
      },
    });

    
    const cancelTransactionTime = new Date(Date.now() + 60 * 60 * 1000);

    schedule.scheduleJob(cancelTransactionTime, async () => {
      console.log(`Checking transaction status for ID: ${transactionId} after 1 hour`);

    
      const currentTransaction = await prisma.transaction.findFirst({
        where: { id: transactionId, userId },
      });

      if (!currentTransaction) {
        console.error('Transaction not found during schedule job');
        return;
      }

      console.log('Current transaction status:', currentTransaction.status);

      if (
        currentTransaction.status ===
        StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION &&
        !currentTransaction.paymentProof
      ) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: StatusTransaction.CANCELLED,
          },
        });
        console.log('Transaction cancelled due to no payment proof uploaded after 1 hour');
      }
    });

    return { message: 'Payment proof uploaded successfully, awaiting confirmation.' };

  } catch (error) {
    console.error('Error during payment proof upload:', error); 
    throw error; 
  }
};
