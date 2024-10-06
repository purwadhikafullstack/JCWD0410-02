import prisma from '@/prisma';

export const deletePeakSeasonRateManagementService = async (id: number) => {
  try {
    const peakSeasonId = await prisma.peakSeasonRate.findUnique({
      where: { id },
    });

    if (!peakSeasonId) {
      throw new Error('Peak Season Id not found');
    }

    const deletePeakSeasonRate = await prisma.peakSeasonRate.delete({
      where: { id },
    });

    return {
      message: 'Delete Peak Season Rate Success',
      data: deletePeakSeasonRate,
    };
  } catch (error) {
    throw error;
  }
};
