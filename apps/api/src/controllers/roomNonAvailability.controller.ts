import { createRoomNonAvailabilityService } from '@/services/roomNonAvailability/create-roomNonAvailability.service';
import { deleteRoomNonAvailabilityService } from '@/services/roomNonAvailability/delete-roomNonAvailabilities.service';
import { getRoomNonAvailabilitiesService } from '@/services/roomNonAvailability/get-roomNonAvailabilities.service';
import { updateRoomNonAvailabilitiyService } from '@/services/roomNonAvailability/update-roomNonAvailability.service';
import { NextFunction, Request, Response } from 'express';

export class RoomNonAvailabilityController {
  async createRoomNonAvailabilityController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createRoomNonAvailabilityService(
        Number(res.locals.user.id),
        req.body,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async updateRoomNonAvailabilitiyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await updateRoomNonAvailabilitiyService(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteRoomNonAvailabilityController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await deleteRoomNonAvailabilityService(
        Number(req.params.id),
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getRoomNonAvailabilitiesController(
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
        reason: (req.query.search as string) || '',
        roomId: Number(req.query.search) || 0,
        startDate: new Date(req.query.search as string) || undefined,
        endDate: new Date(req.query.search as string) || undefined,
      };
      const result = await getRoomNonAvailabilitiesService(
        query,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
