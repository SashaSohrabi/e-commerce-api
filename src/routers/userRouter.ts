import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '#controllers';
import { validateBodyZod, validateParamsZod } from '#middleware';
import { UserInputSchema, IdParamSchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', validateParamsZod(IdParamSchema), getUserById);
userRouter.post('/', validateBodyZod(UserInputSchema), createUser);
userRouter.put(
  '/:id',
  validateParamsZod(IdParamSchema),
  validateBodyZod(UserInputSchema),
  updateUser
);
userRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteUser);

export default userRouter;
