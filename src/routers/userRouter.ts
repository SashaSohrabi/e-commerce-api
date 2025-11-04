import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '#controllers';
import { validateBodyZod } from '#middleware';
import { createUserSchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validateBodyZod(createUserSchema), createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
