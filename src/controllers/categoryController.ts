import { Category } from '#models';
import type { CategoryDTO, CategoryInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import type { RequestHandler } from 'express';

export const createCategory: RequestHandler<unknown, CategoryDTO, CategoryInputDTO> = async (
  req,
  res
) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json({ id: category._id.toString(), name });
};

export const getCategories: RequestHandler<unknown, CategoryDTO[], unknown> = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(
    categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
    }))
  );
};

export const getCategoryById: RequestHandler<
  { id: string },
  CategoryDTO | MessageResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: `No category with id: ${id} found!` });
  }
  res.status(200).json({ id: category._id.toString(), name: category.name });
};

export const updateCategory: RequestHandler<
  { id: string },
  CategoryDTO | MessageResponse,
  CategoryInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
  if (!category) {
    return res.status(404).json({ message: `No category with id: ${id} found!` });
  }
  res.status(200).json({ id: category._id.toString(), name: category.name });
};

export const deleteCategory: RequestHandler<{ id: string }, MessageResponse, unknown> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({ message: `No category with id: ${id} found!` });
  }
  res.status(200).json({ message: 'Category deleted successfully' });
};
