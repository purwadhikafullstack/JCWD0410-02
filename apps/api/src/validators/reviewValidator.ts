import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createReviewValidation = [
  check('transactionId')
    .isInt({ gt: 0 }).withMessage('Transaction ID harus berupa integer positif.'),
  check('propertyId')
    .isInt({ gt: 0 }).withMessage('Property ID harus berupa integer positif.'),
  check('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating harus berupa angka antara 1 sampai 5.'),
  check('review')
    .isString().withMessage('Review harus berupa teks.')
    .isLength({ min: 5 }).withMessage('Review minimal 5 karakter.'),
];

export const replyReviewValidation = [
  check('reviewId')
    .isInt({ gt: 0 }).withMessage('Review ID harus berupa integer positif.'),
  check('reply')
    .isString().withMessage('Reply harus berupa teks.')
    .isLength({ min: 5 }).withMessage('Reply minimal 5 karakter.'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
