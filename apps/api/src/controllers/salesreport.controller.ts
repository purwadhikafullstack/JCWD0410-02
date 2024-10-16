import { getPropertyReportService } from '@/services/reportanalysis/propertyreport.service';
import { getSalesReportService } from '@/services/reportanalysis/salesreport.service';
import { getTenantIdsByUserId } from '@/services/tenanttransactions/orderlist.service';
import { NextFunction, Request, Response } from 'express';

export class SalesPropertyController {
  async getSalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'User ID is missing or invalid' });
      }

      const tenantIds = await getTenantIdsByUserId(userId);

      if (tenantIds.length === 0) {
        return res
          .status(400)
          .json({ message: 'User is not associated with any tenant' });
      }

      const propertyId = req.query.propertyId
        ? parseInt(req.query.propertyId as string)
        : undefined;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      const salesReport = await getSalesReportService({
        tenantIds,
        propertyId,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });

      return res.status(200).json(salesReport);
    } catch (error) {
      next(error);
    }
  }

  async getPropertyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'User ID is missing or invalid' });
      }

      const tenantIds = await getTenantIdsByUserId(userId);

      if (tenantIds.length === 0) {
        return res
          .status(400)
          .json({ message: 'User is not associated with any tenant' });
      }

      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const propertyReport = await getPropertyReportService({
        tenantIds,
        startDate,
        endDate,
      });

      return res.status(200).json(propertyReport);
    } catch (error) {
      next(error);
    }
  }
}
