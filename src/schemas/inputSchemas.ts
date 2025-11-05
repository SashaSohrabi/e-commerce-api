import { z } from 'zod';

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
    price: z.number(),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'categoryId must be a 24 character hex string' }),
  })
  .strict();

export type ProductInputDTO = z.infer<typeof ProductInputSchema>;
export type ProductDTO = ProductInputDTO & { id: string };
