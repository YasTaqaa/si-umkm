// app/dashboard/umkm/add-product/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ImagePlus } from 'lucide-react'

export default function AddProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nama: '', deskripsi: '', harga: '' })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData()
    fd.append('nama', form.nama)
    fd.append('deskripsi', form.deskripsi)
    fd.append('harga', form.harga)
    if (file) fd.append('gambar', file)

    const res = await fetch('/api/rest/products', {
      method: 'POST',
      body: fd,
    })

    setLoading(false)
    if (res.ok) {
      router.push('/dashboard/umkm')
    } else {
      alert('Gagal menambahkan produk')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-green-700 mb-6 flex items-center gap-3">
          <Save size={32} /> Tambah Produk UMKM
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Produk</label>
            <input
              name="nama"
              placeholder="Contoh: Keripik Pisang"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 text-black px-4 py-2 rounded-xl shadow-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Deskripsi Produk</label>
            <textarea
              name="deskripsi"
              placeholder="Deskripsi singkat produk..."
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 text-black px-4 py-2 rounded-xl shadow-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Harga (Rp)</label>
            <input
              name="harga"
              type="number"
              placeholder="Contoh: 15000"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 text-black px-4 py-2 rounded-xl shadow-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 items-center gap-2">
              <ImagePlus size={20} /> Gambar Produk
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  )
}
