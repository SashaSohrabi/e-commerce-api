import { Schema, model } from 'mongoose';
import type { UserType } from '#types';

const userSchema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default model<UserType>('User', userSchema);
