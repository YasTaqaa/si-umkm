// modules/product.ts
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  gambar: String,
  emailUser: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)