import prisma from '@/prisma';
import { StatusTransaction } from '@prisma/client';

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
    return { message: 'Payment proof uploaded successfully, awaiting confirmation.' };

  } catch (error) {
    console.error('Error during payment proof upload:', error); 
    throw error; 
  }
};
