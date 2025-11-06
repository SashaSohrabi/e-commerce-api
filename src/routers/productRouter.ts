import { Router } from 'express';
import { validateBodyZod, validateParamsZod } from '#middleware';
import { ProductInputSchema, IdParamSchema } from '#schemas';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '#controllers';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', validateParamsZod(IdParamSchema), getProductById);
productRouter.post('/', validateBodyZod(ProductInputSchema), createProduct);
productRouter.put(
  '/:id',
  validateParamsZod(IdParamSchema),
  validateBodyZod(ProductInputSchema),
  updateProduct
);
productRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteProduct);

export default productRouter;
