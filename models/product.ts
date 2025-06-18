// modules/product.ts
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  nama: String,
  deskripsi: String,
  harga: Number,
  gambar: String, 
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
