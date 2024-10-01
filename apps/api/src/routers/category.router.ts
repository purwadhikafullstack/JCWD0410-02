import { CategoryController } from '@/controllers/category.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.categoryController.getCategoryList);
    this.router.post(
      '/:id',
      verifyToken,
      this.categoryController.createCategoryController,
    );
    this.router.delete('/:id', this.categoryController.deleteCategory);
    this.router.patch('/:id', this.categoryController.updateCategory);
  }

  getRouter(): Router {
    return this.router;
  }
}
