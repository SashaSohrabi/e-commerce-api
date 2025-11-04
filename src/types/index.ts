import type { ObjectId } from 'mongoose';

export type UserType = {
  name: string;
  email: string;
  password: string;
};

export type ProductType = {
  name: string;
  description: string;
  price: number;
  categoryId: ObjectId;
};

export type CategoryType = {
  name: string;
};

export type OrderType = {
  userId: ObjectId;
  products: {
    productId: ObjectId;
    quantity: number;
  }[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MessageResponse = {
  message: string;
};
