import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '#controllers';
import { validateBodyZod, validateParamsZod } from '#middleware';
import { CategoryInputSchema, IdParamSchema } from '#schemas';

const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', validateParamsZod(IdParamSchema), getCategoryById);
categoryRouter.post('/', validateBodyZod(CategoryInputSchema), createCategory);
categoryRouter.put(
  '/:id',
  validateParamsZod(IdParamSchema),
  validateBodyZod(CategoryInputSchema),
  updateCategory
);
categoryRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteCategory);

export default categoryRouter;
