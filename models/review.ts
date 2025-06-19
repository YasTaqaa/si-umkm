// models/review.ts
import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: String,
  komentar: String,
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)