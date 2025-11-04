import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '#controllers';
import { validateBodyZod } from '#middleware';
import { CategoryInputSchema } from '#schemas';

const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.post('/', validateBodyZod(CategoryInputSchema), createCategory);
categoryRouter.put('/:id', validateBodyZod(CategoryInputSchema), updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
