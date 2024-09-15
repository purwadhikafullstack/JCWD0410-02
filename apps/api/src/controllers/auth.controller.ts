// import { changePasswordService } from '@/services/auth/change-password.service';
// import { forgotPasswordService } from '@/services/auth/forgot-password.service';
// import { loginService } from '@/services/auth/login.service';
// import { resetPasswordService } from '@/services/auth/reset-password.service';
import { registerService } from '@/services/auth/register.service';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
  async registerController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await registerService(req.body);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  // async login(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await loginService(req.body);
  //     return res.status(200).send(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async forgotPassword(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await forgotPasswordService(req.body.email);
  //     return res.status(200).send(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async resetPassword(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await resetPasswordService(
  //       Number(res.locals.user.id),
  //       req.body.password,
  //     );
  //     return res.status(200).send(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async changePassword(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await changePasswordService(
  //       Number(res.locals.user.id),
  //       req.body.password,
  //     );
  //     return res.status(200).send(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
