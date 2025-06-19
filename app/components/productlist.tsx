/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/productlist.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { gql } from '@apollo/client'
import client from '@/lib/apollo/client'
import Link from 'next/link'

const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!) {
    searchProduct(keyword: $keyword) {
      _id
      nama
      deskripsi
      harga
      gambar
      rating
    }
  }
`

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase() || ''

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await client.query({
          query: SEARCH_PRODUCTS,
          variables: { keyword: query },
        })
        setProducts(data.searchProduct)
      } catch (err) {
        console.error('Gagal mengambil data produk:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query])

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Memuat produk...</div>

  if (products.length === 0)
    return <div className="text-center text-gray-500 mt-10">Produk tidak ditemukan.</div>

  return (
    <div className="mt-8 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">📦 Daftar Produk UMKM</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 space-y-2 border cursor-pointer">
              {product.gambar && (
                <div className="w-full h-40 relative rounded overflow-hidden">
                  <Image
                    src={product.gambar}
                    alt={product.nama}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <h3 className="text-lg text-black font-bold">{product.nama}</h3>
              <p className="text-gray-600">{product.deskripsi}</p>
              <p className="text-sm text-gray-800 font-semibold">
                Rp {Number(product.harga).toLocaleString('id-ID')}
              </p>
              <p className="text-yellow-500 font-bold">⭐ {product.rating ?? 0}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}