import { Router } from 'express';
import { validateBodyZod } from '#middleware';
import { ProductInputSchema } from '#schemas';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '#controllers';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', validateBodyZod(ProductInputSchema), createProduct);
productRouter.put('/:id', validateBodyZod(ProductInputSchema), updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
