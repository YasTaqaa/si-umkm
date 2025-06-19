/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/[id]/page.tsx
'use client'

import { gql } from '@apollo/client'
import client from '@/lib/apollo/client'
import { useEffect, useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/lib/auth/firebase' // jika pakai Firebase Auth
import { onAuthStateChanged } from 'firebase/auth'

// QUERY: Ambil detail produk
const GET_PRODUCT = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      _id
      nama
      deskripsi
      harga
      gambar
      rating
    }
  }
`

// QUERY: Ambil semua ulasan
const GET_REVIEWS = gql`
  query GetReviewsByProduct($productId: ID!) {
    getReviewsByProduct(productId: $productId) {
      _id
      nama
      komentar
      rating
    }
  }
`

// MUTATION: Tambah ulasan baru
const ADD_REVIEW = gql`
  mutation AddReview($input: ReviewInput!) {
    addReview(input: $input) {
      _id
    }
  }
`

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const fetchProduct = async () => {
    const { data } = await client.query({
      query: GET_PRODUCT,
      variables: { id },
    })
    setProduct(data.getProductById)
  }

  const fetchReviews = async () => {
    const { data } = await client.query({
      query: GET_REVIEWS,
      variables: { productId: id },
    })
    setReviews(data.getReviewsByProduct)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await client.query({
        query: GET_PRODUCT,
        variables: { id },
      })
      setProduct(data.getProductById)
    }

    const fetchReviews = async () => {
      const { data } = await client.query({
        query: GET_REVIEWS,
        variables: { productId: id },
      })
      setReviews(data.getReviewsByProduct)
    }

    fetchProduct()
    fetchReviews()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const komentar = (form.elements.namedItem('komentar') as HTMLInputElement).value
    const rating = parseInt((form.elements.namedItem('rating') as HTMLInputElement).value)

    if (!user || rating < 1 || rating > 5) return

    await client.mutate({
      mutation: ADD_REVIEW,
      variables: {
        input: {
          productId: id,
          nama: user.displayName || user.email,
          komentar,
          rating,
        },
      },
    })

    form.reset()
    startTransition(() => {
      fetchProduct()
      fetchReviews()
    })
  }

  if (!product) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-xl shadow">
      {/* Gambar Produk */}
      {product.gambar && (
        <div className="w-full h-80 relative rounded mb-6">
          <Image
            src={product.gambar}
            alt={product.nama}
            fill
            className="object-cover object-center rounded"
          />
        </div>
      )}

      {/* Detail Produk */}
      <h1 className="text-3xl font-bold text-green-700 mb-2">{product.nama}</h1>
      <p className="text-gray-600 mb-4">{product.deskripsi}</p>
      <p className="text-lg font-semibold mb-2">Harga: Rp {product.harga.toLocaleString()}</p>
      <p className="text-yellow-600 font-bold mb-6">⭐ Rating: {product.rating?.toFixed(1) ?? '0'}</p>

      {/* Form Ulasan */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-3">📝 Tulis Ulasan</h2>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nama"
              value={user.displayName || user.email || ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
            <textarea
              name="komentar"
              placeholder="Komentar"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              required
              className="w-full p-2 border rounded"
              placeholder="Rating (1-5)"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 italic">Silakan login untuk memberi ulasan.</p>
        )}
      </div>

      {/* Daftar Ulasan */}
      <div>
        <h2 className="text-xl font-bold mb-3">💬 Ulasan Pengguna</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 bg-gray-100 rounded-md">
                <p className="font-semibold text-black">{review.nama || 'Pengguna Anonim'}</p>
                <p className="text-yellow-600">⭐ {review.rating}</p>
                <p className="text-gray-700">{review.komentar}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
