import { Schema, model } from 'mongoose';
import type { OrderType } from '#types';

const orderSchema = new Schema<OrderType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<OrderType>('Order', orderSchema);
