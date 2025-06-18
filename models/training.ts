// models/training.ts
import mongoose from 'mongoose'

const trainingSchema = new mongoose.Schema({
  judul: String,
  deskripsi: String,
  tanggal: Date,
  pemateri: String,
})

export default mongoose.models.Training || mongoose.model('Training', trainingSchema)
