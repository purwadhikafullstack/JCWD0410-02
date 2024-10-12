import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

export const uploader = (fileLimit?: number) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const extAllowed = /\.(jpg|jpeg|png|gif)$/;
    const isExtMatch = file.originalname.toLocaleLowerCase().match(extAllowed);
    if (isExtMatch) {
      cb(null, true);
    } else {
      const error = new Error('Your file extension is denied');
      cb(error);
    }
  };

  const limits = { fileSize: fileLimit || 1 * 1024 * 1024 };

  return multer({ storage, fileFilter, limits });
};
