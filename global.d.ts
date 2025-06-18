/* eslint-disable no-var */
// global.d.ts
import mongoose from 'mongoose'

declare global {
  var mongooseGlobal: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export {}
