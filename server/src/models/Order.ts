import mongoose, { Document, Schema, Model } from "mongoose";
import { IAddress } from "./User";

export type OrderPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type OrderFulfillmentStatus =
  "CONFIRMED" | "PREPARING_IN_ATELIER" | "DISPATCHED" | "DELIVERED" | "CANCELLED";

export interface IOrderItemSnapshot {
  productId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: IOrderItemSnapshot[];
  shippingAddress: IAddress;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  giftPackaging: boolean;
  paymentStatus: OrderPaymentStatus;
  paymentProvider?: "STRIPE" | "RAZORPAY" | "DEMO";
  paymentReference?: string;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNumber?: string;
  timeline: IOrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSnapshotSchema = new Schema<IOrderItemSnapshot>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false },
);

const OrderTimelineSchema = new Schema<IOrderTimeline>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    customerEmail: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    items: [OrderItemSnapshotSchema],
    shippingAddress: { type: AddressSchema, required: true },
    shippingMethod: { type: String, default: "Standard Atelier Delivery" },
    shippingFee: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true, min: 0 },
    giftPackaging: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    paymentProvider: { type: String, enum: ["STRIPE", "RAZORPAY", "DEMO"], default: "DEMO" },
    paymentReference: { type: String },
    fulfillmentStatus: {
      type: String,
      enum: ["CONFIRMED", "PREPARING_IN_ATELIER", "DISPATCHED", "DELIVERED", "CANCELLED"],
      default: "CONFIRMED",
      index: true,
    },
    trackingNumber: { type: String },
    timeline: [OrderTimelineSchema],
  },
  { timestamps: true },
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
