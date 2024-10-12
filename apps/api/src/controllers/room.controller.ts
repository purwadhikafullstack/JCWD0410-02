import { createRoomService } from '@/services/room/create-room.service';
import { deleteRoomService } from '@/services/room/delete-room.service';
import { getRoomService } from '@/services/room/get-room.service';
import { getRoomsService } from '@/services/room/get-rooms.service';
import { updateRoomService } from '@/services/room/update-room.service';
import { NextFunction, Request, Response } from 'express';

export class RoomController {
  async getRoomsController(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json({ message: 'User ID is missing or invalid' });
      }
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
      const result = await getRoomsService(query, Number(res.locals.user.id));
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
