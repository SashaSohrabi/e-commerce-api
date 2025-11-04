import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().min(3).max(30),
  password: z.string().min(8).max(20),
});

export type UserInputDTO = z.infer<typeof createUserSchema>;
export type UserDTO = Omit<UserInputDTO, 'password'> & { id: string };
