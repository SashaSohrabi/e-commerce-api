import { Schema, model } from 'mongoose';
import type { ProductType } from '#types';

const productSchema = new Schema<ProductType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  image_url: {
    type: [String],
  },
});

export default model<ProductType>('Product', productSchema);
