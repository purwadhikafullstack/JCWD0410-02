import { getPropertyService } from '@/services/property/get-property.service';
import { NextFunction, Request, Response } from 'express';

export class PropertyController {
  async getPropertyController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
      };
      const result = await getPropertyService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
