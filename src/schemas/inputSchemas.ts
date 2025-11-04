import { z } from 'zod';

export const UserInputSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().min(3).max(30),
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
