import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '#controllers';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);  

export default userRouter;