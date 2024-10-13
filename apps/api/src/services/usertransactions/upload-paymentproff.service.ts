import { cloudinaryUpload } from '@/lib/cloudinary'; // Import fungsi cloudinaryUpload yang benar
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

    const uploadResult = await cloudinaryUpload(file); 

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: uploadResult.secure_url, 
        status: StatusTransaction.WAITING_FOR_PAYMENT_CONFIRMATION,
      },
    });

    return { message: 'Payment proof uploaded successfully, awaiting confirmation.' };

  } catch (error) {
    throw error;
  }
};
