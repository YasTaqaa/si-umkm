/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/parser/multipart.ts
import Busboy from 'busboy'
import path from 'path'
import fs from 'fs'
import { mkdir } from 'fs/promises'

export async function parseMultipartFormData(req: Request): Promise<{ fields: any; filePath: string }> {
  return new Promise(async (resolve, reject) => {
    // 🔧 Konversi headers Web API → plain object
    const headers = Object.fromEntries(req.headers.entries())
    const busboy = Busboy({ headers })

    const fields: Record<string, string> = {}
    let filePath = ''

    await mkdir('public/uploads', { recursive: true })

    // Web Request → ReadableStream → Buffer
    const reader = req.body?.getReader()
    const chunks: Uint8Array[] = []

    if (!reader) return reject('No reader found')

    let done = false
    while (!done) {
      const { done: doneReading, value } = await reader.read()
      if (value) chunks.push(value)
      done = doneReading
    }

    const buffer = Buffer.concat(chunks)

    // Tangani file upload
    busboy.on('file', (fieldname, file, filename) => {
      const saveTo = path.join('public/uploads', `${Date.now()}-${filename}`)
      const writeStream = fs.createWriteStream(saveTo)
      file.pipe(writeStream)
      filePath = '/' + saveTo.replace(/\\/g, '/')
    })

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value
    })

    busboy.on('finish', () => {
      resolve({ fields, filePath })
    })

    busboy.on('error', (err) => reject(err))

    busboy.end(buffer)
  })
}
