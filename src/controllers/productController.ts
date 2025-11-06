import { Product, Category } from '#models';
import { Types } from 'mongoose';
import type { ProductDTO, ProductInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import type { RequestHandler } from 'express';

export const createProduct: RequestHandler<
  unknown,
  ProductDTO | MessageResponse,
  ProductInputDTO
> = async (req, res) => {
  const { name, description, price, categoryId } = req.body;

  const categoryObjectId = new Types.ObjectId(categoryId);
  const categoryExists = await Category.exists({ _id: categoryObjectId });
  
  if (!categoryExists) {
    return res.status(404).json({ message: `No category with id: ${categoryId} found!` });
  }

  const product = await Product.create({
    name,
    description,
    price,
    categoryId: categoryObjectId,
  });
  res
    .status(201)
    .json({ id: product._id.toString(), name, description, price, categoryId: categoryId });
};

export const getProducts: RequestHandler<unknown, ProductDTO[] | MessageResponse, unknown> = async (
  req,
  res
) => {
  const filters: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(req.query)) {
    if (value === undefined) continue;

    if (key === 'categoryId' && typeof value === 'string') {
      if (!Types.ObjectId.isValid(value)) {
        return res.status(400).json({ message: 'categoryId must be a valid ObjectId' });
      }
      filters.categoryId = new Types.ObjectId(value);
      continue;
    }

    if ((key === 'name' || key === 'description') && typeof value === 'string') {
      const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filters[key] = new RegExp(escapedValue, 'i');
      continue;
    }

    filters[key] = value;
  }

  const products = await Product.find(filters);
  res.status(200).json(
    products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId?.toString(),
    }))
  );
};

export const getProductById: RequestHandler<
  { id: string },
  ProductDTO | MessageResponse,
  ProductInputDTO
> = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: `No product with id: ${id} found!` });
  }

  res.status(200).json({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId.toString(),
  });
};

export const updateProduct: RequestHandler<
  { id: string },
  ProductDTO | MessageResponse,
  ProductInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, categoryId } = req.body;

  const categoryObjectId = new Types.ObjectId(categoryId);
  const categoryExists = await Category.exists({ _id: categoryObjectId });

  if (!categoryExists) {
    return res.status(404).json({ message: `No category with id: ${categoryId} found!` });
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      categoryId: categoryObjectId,
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: `No product with id: ${id} found!` });
  }

  res.status(200).json({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId.toString(),
  });
};

export const deleteProduct: RequestHandler<{ id: string }, MessageResponse, unknown> = async (
  req,
  res
) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({ message: `No product with id: ${id} found!` });
  }
  res.status(200).json({ message: 'Product deleted successfully' });
};
