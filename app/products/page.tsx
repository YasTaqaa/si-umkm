/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/page.tsx

'use client'
import { gql, useQuery } from '@apollo/client'
import { client } from '@/lib/graphql/apollo-client'

const CARI_PRODUK = gql`
  query CariProduk($keyword: String!) {
    cariProduk(keyword: $keyword) {
      id
      name
      price
    }
  }
`

export default function ProductsPage() {
  const { data, loading, error } = useQuery(CARI_PRODUK, {
    variables: { keyword: 'Produk' },
    client,
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hasil Pencarian Produk</h1>
      <ul className="space-y-2">
        {data?.cariProduk.map((produk: any) => (
          <li key={produk.id} className="p-4 rounded bg-gray-100">
            <p className="font-medium">{produk.name}</p>
            <p className="text-sm text-gray-600">Rp {produk.price.toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
