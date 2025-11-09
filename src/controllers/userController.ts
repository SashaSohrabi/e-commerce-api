import { User } from '#models';
import type { UserDTO, UserInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import type { RequestHandler } from 'express';

export const createUser: RequestHandler<unknown, UserDTO | MessageResponse, UserInputDTO> = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    return res.status(409).json({ message: `User with email: ${email} already exists!` })
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ id: user._id.toString(), name, email } as UserDTO);
};

export const getUsers: RequestHandler<unknown, UserDTO[], unknown> = async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(
    users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }))
  );
};

export const getUserById: RequestHandler<
  { id: string },
  UserDTO | MessageResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  res.status(200).json({ id: user._id.toString(), name: user.name, email: user.email });
};

export const updateUser: RequestHandler<
  { id: string },
  UserDTO | MessageResponse,
  UserInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findByIdAndUpdate(id, { name, email, password }, { new: true }).select(
    '-password'
  );
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  res.status(200).json({ id: user._id.toString(), name: user.name, email: user.email });
};

export const deleteUser: RequestHandler<{ id: string }, MessageResponse, unknown> = async (
  req,
  res
) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: `No user with id: ${id} found!` });
  }
  res.status(200).json({ message: 'User deleted successfully' });
};
