import { Router } from 'express';
import { validateBodyZod, validateParamsZod } from '#middleware';
import { OrderInputSchema, IdParamSchema } from '#schemas';
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '#controllers';

const orderRouter = Router();

orderRouter.get('/', getOrders);
orderRouter.get('/:id', validateParamsZod(IdParamSchema), getOrderById);
orderRouter.post('/', validateBodyZod(OrderInputSchema), createOrder);
orderRouter.put(
  '/:id',
  validateParamsZod(IdParamSchema),
  validateBodyZod(OrderInputSchema),
  updateOrder
);
orderRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteOrder);

export default orderRouter;
