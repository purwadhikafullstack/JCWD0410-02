import { createPropertyService } from '@/services/property/create-property.service';
import { deletePropertyService } from '@/services/property/delete-property.service';
import { getTenantPropertiesService } from '@/services/property/get-properties-tenant.service';
import { getPropertiesService } from '@/services/property/get-properties.service';
import { getPropertiesServiceByQuery } from '@/services/property/get-propertiesByQuery.service';
import { getPropertyTenantService } from '@/services/property/get-property-tenant.service';
import { getPropertyService } from '@/services/property/get-property.service';
import { updatePropertyService } from '@/services/property/update-property.service';
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
        guest: Number(req.query.guest) || 2,
        title: (req.query.title as string) || '',
        startDate: new Date(req.query.startDate as string) || undefined,
        endDate: new Date(req.query.endDate as string) || undefined,
      };
      const result = await getPropertiesService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getTenantPropertiesController(
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
        guest: Number(req.query.guest) || 2,
        title: (req.query.title as string) || '',
        startDate: new Date(req.query.startDate as string) || undefined,
        endDate: new Date(req.query.endDate as string) || undefined,
      };
      const result = await getTenantPropertiesService(
        query,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getPropertiesByQueryController(
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
        guest: Number(req.query.guest) || 2,
        title: (req.query.title as string) || '',
        startDate: new Date(req.query.startDate as string) || undefined,
        endDate: new Date(req.query.endDate as string) || undefined,
      };
      const result = await getPropertiesServiceByQuery(query);
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
  async getPropertyTenantController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getPropertyTenantService(Number(req.params.id));
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async createPropertyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createPropertyService(
        req.body,
        req.file!,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deletePropertyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await deletePropertyService(
        Number(req.params.id),
        Number(res.locals.user.id),
      );
      return res
        .status(200)
        .send({ message: 'Delete property success', result });
    } catch (error) {
      next(error);
    }
  }
  async updatePropertyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await updatePropertyService(
        Number(res.locals.user.id),
        Number(req.params.id),
        req.body,
        req.file!,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
