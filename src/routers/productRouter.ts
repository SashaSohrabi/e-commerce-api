import { Router } from 'express';
import { validateBodyZod, validateParamsZod, upload } from '#middleware';
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
productRouter.post(
  '/',
  upload.array('image', 5),
  validateBodyZod(ProductInputSchema),
  createProduct
);
productRouter.put(
  '/:id',
  upload.array('image', 5),
  validateParamsZod(IdParamSchema),
  validateBodyZod(ProductInputSchema),
  updateProduct
);
productRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteProduct);

export default productRouter;
