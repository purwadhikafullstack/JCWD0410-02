import { createCategoryService } from '@/services/category/create-category.service';
import { deleteCategoryService } from '@/services/category/delete-category.service';
import { getCategoriesService } from '@/services/category/get-category.service';
import { updateCategoryService } from '@/services/category/update-category.service';
import { NextFunction, Request, Response } from 'express';

export class CategoryController {
  async getCategoryList(req: Request, res: Response, next: NextFunction) {
    const userId = res.locals.user?.id;
    try {
      const query = {
        take: parseInt(req.query.take as string) || 7,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        propertyCategoryId:
          parseInt(req.query.propertyCategoryId as string) || 1,
      };

      const result = await getCategoriesService(
        query,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async createCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createCategoryService(
        req.body,
        Number(res.locals.user.id),
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteCategoryService(Number(req.params.id));
      return res
        .status(200)
        .send({ message: 'Delete category success', result });
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await updateCategoryService(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
