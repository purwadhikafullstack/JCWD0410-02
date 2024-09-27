import { JWT_SECRET } from '@/config';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, verify } from 'jsonwebtoken';

const secretKey = JWT_SECRET!;

interface PayloadToken extends Pick<User, 'id'> {}

declare global {
  namespace Express {
    interface Request {
      user?: PayloadToken | null;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: 'token is missing',
    });
  }

  verify(token, secretKey, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: 'token expired', token });
      } else {
        return res.status(401).send({ message: 'invalid token' });
      }
    }
    res.locals.user = payload as PayloadToken;
    next();
  });
};