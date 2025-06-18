'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/app/navbar/page' // ✅ Tambahkan Navbar

export default function AdminDashboard() {
  const [umkmCount, setUmkmCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [trainingCount, setTrainingCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [umkmRes, productRes, trainingRes] = await Promise.all([
          fetch('/api/rest/users/count?role=umkm'),
          fetch('/api/rest/products/count'),
          fetch('/api/rest/trainings/count'),
        ])

        const umkmData = await umkmRes.json()
        const productData = await productRes.json()
        const trainingData = await trainingRes.json()

        setUmkmCount(umkmData.count || 0)
        setProductCount(productData.count || 0)
        setTrainingCount(trainingData.count || 0)
      } catch (err) {
        console.error('Gagal mengambil data statistik:', err)
      }
    }

    fetchCounts()
  }, [])

  return (
    <>
      <Navbar /> {/* ✅ Navbar ditambahkan */}
      <main className="min-h-screen bg-gray-50 text-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-green-700">📊 Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Selamat datang di panel admin Si-UMKM 🎉</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Link href="/dashboard/admin/users">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:bg-blue-50 transition cursor-pointer">
                <h2 className="text-lg font-semibold">👥 Total UMKM</h2>
                <p className="text-2xl font-bold mt-2">{umkmCount}</p>
              </div>
            </Link>

            <Link href="/dashboard/admin/products">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:bg-blue-50 transition cursor-pointer">
                <h2 className="text-lg font-semibold">🛍️ Total Produk</h2>
                <p className="text-2xl font-bold mt-2">{productCount}</p>
              </div>
            </Link>

            <Link href="/dashboard/admin/trainings">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:bg-blue-50 transition cursor-pointer">
                <h2 className="text-lg font-semibold">🎓 Pelatihan Aktif</h2>
                <p className="text-2xl font-bold mt-2">{trainingCount}</p>
              </div>
            </Link>

            <Link href="/dashboard/admin/analytics">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:bg-blue-50 transition cursor-pointer">
                <h2 className="text-lg font-semibold">📈 Kunjungan Hari Ini</h2>
                <p className="text-2xl font-bold mt-2">0</p> {/* Placeholder */}
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
