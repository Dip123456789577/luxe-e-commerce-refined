import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  size: string;
  color: string;
  quantity: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  guestToken?: string;
  items: ICartItem[];
  giftPackaging: boolean;
  appliedCoupon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
  },
  { _id: false },
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestToken: { type: String, index: true },
    items: [CartItemSchema],
    giftPackaging: { type: Boolean, default: false },
    appliedCoupon: { type: String },
  },
  { timestamps: true },
);

export const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
