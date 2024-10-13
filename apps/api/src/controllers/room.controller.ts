import { createRoomService } from '@/services/room/create-room.service';
import { deleteRoomService } from '@/services/room/delete-room.service';
import { getRoomService } from '@/services/room/get-room.service';
import { getRoomsTenantService } from '@/services/room/get-rooms-tenant.service';
import { getRoomsService } from '@/services/room/get-rooms.service';
import { updateRoomService } from '@/services/room/update-room.service';
import { NextFunction, Request, Response } from 'express';

export class RoomController {
  async getRoomsController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
      };
      const result = await getRoomsService(query);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getRoomsTenantController(
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
      };
      const result = await getRoomsTenantService(
        query,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getRoomController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getRoomService(Number(req.params.id));
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async createRoomController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createRoomService(
        req.body,
        req.file!,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteRoomController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteRoomService(
        Number(req.params.id),
        Number(res.locals.user.id),
      );
      return res.status(200).send({ message: 'Delete room success', result });
    } catch (error) {
      next(error);
    }
  }
  async updateRoomController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await updateRoomService(
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
