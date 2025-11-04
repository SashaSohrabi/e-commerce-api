import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '#controllers';
import { validateBodyZod } from '#middleware';
import { UserInputSchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', validateBodyZod(UserInputSchema), createUser);
userRouter.put('/:id', validateBodyZod(UserInputSchema), updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
