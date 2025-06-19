// models/training.ts

import mongoose from 'mongoose'

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  youtubeUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Training || mongoose.model('Training', trainingSchema)