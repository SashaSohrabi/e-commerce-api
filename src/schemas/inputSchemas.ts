import { z } from 'zod';
import { Types } from 'mongoose';

const ObjectIdStringSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'must be a 24 character hex string' })
  .refine((val) => Types.ObjectId.isValid(val), { message: 'must be a valid ObjectId' });

export const IdParamSchema = z.object({
  id: ObjectIdStringSchema,
});

export const UserInputSchema = z
  .object({
    name: z.string().min(2),
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: 'email must be a valid email address',
      })
      .min(3)
      .max(30),
    password: z.string().min(8).max(20),
  })
  .strict();
export type UserInputDTO = z.infer<typeof UserInputSchema>;
export type UserDTO = Omit<UserInputDTO, 'password'> & { id: string };

export const CategoryInputSchema = z
  .object({
    name: z.string().min(3),
  })
  .strict();

export type CategoryInputDTO = z.infer<typeof CategoryInputSchema>;
export type CategoryDTO = CategoryInputDTO & { id: string };

export const ProductInputSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().max(100),
    price: z.coerce.number(), // Multer leaves form-data scalars as strings, so coerce before validation
    categoryId: ObjectIdStringSchema,
    image_url: z.array(z.url()).optional(),
  })
  .strict();

export type ProductInputDTO = z.infer<typeof ProductInputSchema>;
export type ProductDTO = ProductInputDTO & { id: string; image_url?: string[] };

export const OrderInputSchema = z
  .object({
    userId: ObjectIdStringSchema,
    products: z
      .array(
        z
          .object({
            productId: ObjectIdStringSchema,
            quantity: z.number().int().positive(),
          })
          .strict()
      )
      .min(1),
  })
  .strict();

export type OrderInputDTO = z.infer<typeof OrderInputSchema>;
export type OrderDTO = OrderInputDTO & {
  id: string;
  total: number;
  createdAt: string;
  updatedAt: string;
};
