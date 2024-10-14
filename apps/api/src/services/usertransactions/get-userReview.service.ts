import { Prisma } from '@prisma/client';
import prisma from '@/prisma';

interface GetPropertyReviewsService {
  propertyId: number;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getPropertyReviewsService = async (
  query: GetPropertyReviewsService,
) => {
  try {
    const {
      propertyId,
      page = 1,
      take = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const whereClause: Prisma.ReviewWhereInput = {
      propertyId,
      transaction: {
        status: 'PROCESSED',
      },
    };

    const reviews = await prisma.review.findMany({
      where: whereClause,
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        transaction: {
          include: {
            room: {
              select: {
                name: true,
                property: {
                  select: {
                    title: true,
                    tenant: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const total = await prisma.review.count({
      where: whereClause,
    });

    const averageRating = await prisma.review.aggregate({
      where: {
        propertyId,
      },
      _avg: {
        rating: true,
      },
    });

    const dataWithReviewId = reviews.map((review) => ({
      ...review,
      reviewId: review.id,
      tenantId: review.transaction?.room?.property?.tenant?.id,
    }));

    return {
      data: dataWithReviewId,
      meta: {
        total,
        take,
        page,
        averageRating: averageRating._avg?.rating || 0,
      },
    };
  } catch (error) {
    throw error;
  }
};
