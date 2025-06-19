// modules/product.ts
import { Schema, Document, model, models } from 'mongoose'

export interface IProduct extends Document {
  nama: string
  deskripsi: string
  harga: number
  gambar: string
  emailUser: string
  rating: number
}

const ProductSchema = new Schema<IProduct>({
  nama: { type: String, required: true },
  deskripsi: { type: String, required: true },
  harga: { type: Number, required: true },
  gambar: { type: String, required: true },
  emailUser: { type: String, required: true },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
})

export default models.Product || model<IProduct>('Product', ProductSchema)
