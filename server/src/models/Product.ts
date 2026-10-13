import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  subtitle?: string;
  sku: string;
  category: string;
  categoryId?: mongoose.Types.ObjectId;
  price: number;
  compareAt?: number;
  stock: number;
  images: string[];
  badge?: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  craftsmanship?: string;
  materials?: string;
  care?: string;
  origin?: string;
  isPublished: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    subtitle: { type: String },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true, min: 0, index: true },
    compareAt: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 10, min: 0 },
    images: { type: [String], default: [] },
    badge: { type: String },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    craftsmanship: { type: String },
    materials: { type: String },
    care: { type: String },
    origin: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", description: "text", category: "text" });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
