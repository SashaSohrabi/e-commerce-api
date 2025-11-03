import { Router } from 'express';

const orderRouter = Router();

orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.post('/', createOrder);
orderRouter.put('/:id', updateOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;
