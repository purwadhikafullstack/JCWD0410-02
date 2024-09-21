import { NextFunction, Request, Response } from 'express';
import { changePasswordService } from '@/services/auth/change-password.service';
import { forgotPasswordService } from '@/services/auth/forgot-password.service';
import { getUserService } from '@/services/auth/get-user.service';
import { loginWithGoogleService } from '@/services/auth/google.service';
import { loginService } from '@/services/auth/login.service';
import { registerService } from '@/services/auth/register.service';
import { resetPasswordService } from '@/services/auth/reset-password.service';
import { updateProfileService } from '@/services/auth/update-user.service';
import { verifyService } from '@/services/auth/verify.service';
import { changeEmailService } from '@/services/auth/change-email.service';
import { verifyChangeEmailService } from '@/services/auth/verify-change-email.service';

export class AuthController {
  async registerController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await registerService(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async verifyController(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(res.locals.user.id);
      const password = req.body.password;
      const result = await verifyService(userId, password);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await loginService(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async forgotPasswordController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await forgotPasswordService(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async resetPasswordController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(res.locals.user.id);
      const password = req.body.password;
      const result = await resetPasswordService(userId, password);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async loginWithGoogleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { accessToken } = req.body;
      const result = await loginWithGoogleService(accessToken);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getUserController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await getUserService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async updateProfileController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await updateProfileService(
        Number(req.params.id),
        req.body,
        req.file!,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await changePasswordService(
        Number(res.locals.user.id),
        req.body.password,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async changeEmailController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await changeEmailService(
        Number(res.locals.user.id),
        req.body.email,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async changeEmailVerificationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(res.locals.user.id);
      const result = await verifyChangeEmailService(userId);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
