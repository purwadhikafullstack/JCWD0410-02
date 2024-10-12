import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name').notEmpty().withMessage('Validation: Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Validation: Email is required')
    .isEmail(),
  body('role')
    .notEmpty()
    .withMessage('Validation: Role is missing')
    .custom((value) => {
      if (value !== 'USER' && value !== 'TENANT') {
        throw new Error('Role validation Error');
      } else {
        return value;
      }
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Validation: Email is required')
    .isEmail(),
  body('password')
    .notEmpty()
    .withMessage('Validation: Password is required')
    .isLength({ min: 6 })
    .isStrongPassword({
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];

export const validateVerification = [
  body('password')
    .notEmpty()
    .withMessage('Validation: Password is required')
    .isLength({ min: 6 })
    .isStrongPassword({
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    }),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Validation: Password is required')
    .isLength({ min: 6 })
    .isStrongPassword({
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    }),
];
