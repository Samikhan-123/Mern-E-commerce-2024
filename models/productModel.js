// models/Product.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  photo: {
    data: Buffer, 
    contentType: String,
  },
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

