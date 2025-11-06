import { Order, Product, User } from '#models';
import type { OrderDTO, OrderInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import type { RequestHandler } from 'express';
import { Types } from 'mongoose';

const toOrderDTO = (order: any): OrderDTO => ({
  id: order._id.toString(),
  userId: order.userId.toString(),
  products: order.products.map((item: any) => ({
    productId: item.productId.toString(),
    quantity: item.quantity,
  })),
  total: order.total,
  createdAt: (order.createdAt ?? new Date()).toISOString(),
  updatedAt: (order.updatedAt ?? new Date()).toISOString(),
});

const normalizeProducts = async (
  products: OrderInputDTO['products']
): Promise<
  | { ok: true; items: { productId: Types.ObjectId; quantity: number }[]; total: number }
  | { ok: false; status: number; response: MessageResponse }
> => {
  const objectIds: Types.ObjectId[] = [];

  for (const { productId } of products) {
    objectIds.push(new Types.ObjectId(productId));
  }

  const productDocs = await Product.find({ _id: { $in: objectIds } })
    .select(['_id', 'price'])
    .lean();

  const priceById = new Map(productDocs.map((doc) => [doc._id.toString(), doc.price]));
  const missing = products.find((item) => !priceById.has(item.productId));
  if (missing) {
    return {
      ok: false,
      status: 404,
      response: { message: `No product with id: ${missing.productId} found!` },
    };
  }

  const items = products.map((item, index) => ({
    productId: objectIds[index]!,
    quantity: item.quantity,
  }));

  const total = products.reduce(
    (sum, item) => sum + (priceById.get(item.productId) ?? 0) * item.quantity,
    0
  );

  return { ok: true, items, total };
};

export const createOrder: RequestHandler<
  unknown,
  OrderDTO | MessageResponse,
  OrderInputDTO
> = async (req, res) => {
  const { userId, products } = req.body;

  const userObjectId = new Types.ObjectId(userId);

  const userExists = await User.exists({ _id: userObjectId });
  if (!userExists) {
    return res.status(404).json({ message: `No user with id: ${userId} found!` });
  }

  const normalized = await normalizeProducts(products);
  if (!normalized.ok) {
    return res.status(normalized.status).json(normalized.response);
  }

  const order = await Order.create({
    userId: userObjectId,
    products: normalized.items,
    total: normalized.total,
  });

  return res.status(201).json(toOrderDTO(order.toObject()));
};

export const getOrders: RequestHandler<unknown, OrderDTO[] | MessageResponse, unknown> = async (
  req,
  res
) => {
  const filters: Record<string, unknown> = {};

  if (typeof req.query.userId === 'string' && req.query.userId.length > 0) {
    if (!Types.ObjectId.isValid(req.query.userId)) {
      return res.status(400).json({ message: 'userId must be a valid ObjectId' });
    }
    filters.userId = new Types.ObjectId(req.query.userId);
  }

  const orders = await Order.find(filters);
  return res.status(200).json(orders.map((order) => toOrderDTO(order)));
};

export const getOrderById: RequestHandler<
  { id: string },
  OrderDTO | MessageResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: `No order with id: ${id} found!` });
  }

  return res.status(200).json(toOrderDTO(order));
};

export const updateOrder: RequestHandler<
  { id: string },
  OrderDTO | MessageResponse,
  OrderInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { userId, products } = req.body;

  const userObjectId = new Types.ObjectId(userId);

  const userExists = await User.exists({ _id: userObjectId });
  if (!userExists) {
    return res.status(404).json({ message: `No user with id: ${userId} found!` });
  }

  const normalized = await normalizeProducts(products);
  if (!normalized.ok) {
    return res.status(normalized.status).json(normalized.response);
  }

  const order = await Order.findByIdAndUpdate(
    id,
    {
      userId: userObjectId,
      products: normalized.items,
      total: normalized.total,
    },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: `No order with id: ${id} found!` });
  }

  return res.status(200).json(toOrderDTO(order));
};

export const deleteOrder: RequestHandler<{ id: string }, MessageResponse, unknown> = async (
  req,
  res
) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    return res.status(404).json({ message: `No order with id: ${id} found!` });
  }

  return res.status(200).json({ message: 'Order deleted successfully' });
};
