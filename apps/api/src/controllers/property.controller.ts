import { getPropertiesService } from '@/services/property/get-properties.service';
import { getPropertyService } from '@/services/property/get-property.service';
import { NextFunction, Request, Response } from 'express';

export class PropertyController {
  async getPropertiesController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        guest: Number(req.query.search) || 2,
        startDate: new Date(req.query.search as string) || undefined,
        endDate: new Date(req.query.search as string) || undefined,
      };
      const result = await getPropertiesService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getPropertyController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getPropertyService(req.params.slug);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
