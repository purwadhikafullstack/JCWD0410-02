import { createPeakSeasonRateManagementService } from '@/services/peakSeasonRateManagement/create-seasonRateManagement.service';
import { deletePeakSeasonRateManagementService } from '@/services/peakSeasonRateManagement/delete-seasonRateManagement.service';
import { getPeakSeasonsService } from '@/services/peakSeasonRateManagement/get-peakSeasons.service';
import { updatePeakSeasonRateManagementService } from '@/services/peakSeasonRateManagement/update-seasonRateManagement.service';
import { NextFunction, Request, Response } from 'express';

export class PeakSeasonRateController {
  async createPeakSeasonRateontroller(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createPeakSeasonRateManagementService(
        Number(res.locals.user.id),
        req.body,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async updatePeakSeasonRateontroller(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await updatePeakSeasonRateManagementService(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deletePeakSeasonRateontroller(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await deletePeakSeasonRateManagementService(
        Number(req.params.id),
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getPeakSeasonsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'asc',
        search: (req.query.search as string) || '',
        price: Number(req.query.search) || 0,
        roomId: Number(req.query.search) || 0,
        startDate: new Date(req.query.search as string) || undefined,
        endDate: new Date(req.query.search as string) || undefined,
      };
      const result = await getPeakSeasonsService(
        query,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
