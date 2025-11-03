import { Router } from 'express';

const productRouter = Router();

productRouter.get('/', getProducts); //TODO: Implement GET /products (supports ?categoryId= filter)
productRouter.get('/:id', getProductById);
productRouter.post('/', createProduct);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
