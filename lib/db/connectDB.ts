/* eslint-disable no-var */
// lib/db/connectDB.ts
import mongoose from 'mongoose'

const MONGODB_URI = (process.env.MONGODB_URI || 'mongodb://localhost:27017/si-umkm')

// Tambah global typing untuk cache koneksi (hindari multiple connections)
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache
}

// Gunakan cache global agar tidak reconnect terus-menerus di dev
const globalWithMongoose = global as typeof globalThis & {
  mongooseCache: MongooseCache
}

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null }
}

export async function connectDB() {
  const cache = globalWithMongoose.mongooseCache

  if (cache.conn) return cache.conn
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'si-umkm'
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}
