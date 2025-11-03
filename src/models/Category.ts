import { Schema, model } from 'mongoose';
import type { CategoryType } from '#types';

const categorySchema = new Schema<CategoryType>({
  name: { type: String, required: true },
});

export default model<CategoryType>('Category', categorySchema);
