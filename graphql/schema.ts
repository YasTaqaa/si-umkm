/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-tag'
import Product from '@/models/product'
import Review from '@/models/review'

export const typeDefs = gql`
  type Product {
    _id: ID!
    nama: String!
    deskripsi: String
    harga: Int!
    gambar: String
    rating: Float
  }

  type Review {
    _id: ID!
    productId: ID!
    nama: String
    komentar: String
    rating: Int
  }

  input ProductInput {
    nama: String!
    deskripsi: String
    harga: Int!
    gambar: String
  }

  input ReviewInput {
    productId: ID!
    nama: String
    komentar: String
    rating: Int!
  }

  type Query {
    searchProduct(keyword: String!): [Product!]!
    getAllProducts: [Product!]!
    getProductById(id: ID!): Product
    getReviewsByProduct(productId: ID!): [Review!]!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
    addReview(input: ReviewInput!): Review
  }
`

export const resolvers = {
  Query: {
    searchProduct: async (_: any, { keyword }: { keyword: string }) => {
      const regex = new RegExp(keyword, 'i')
      const products = await Product.find({
        $or: [
          { nama: { $regex: regex } },
          { deskripsi: { $regex: regex } },
        ],
      })

      return Promise.all(
        products.map(async (p: any) => ({
          ...p.toObject(),
          rating: await getAverageRating(p._id),
        }))
      )
    },
    getAllProducts: async () => {
      const products = await Product.find()
      return Promise.all(
        products.map(async (p: any) => ({
          ...p.toObject(),
          rating: await getAverageRating(p._id),
        }))
      )
    },
    getProductById: async (_: any, { id }: { id: string }) => {
      const product = await Product.findById(id)
      const rating = await getAverageRating(id)
      return { ...product.toObject(), rating }
    },
    getReviewsByProduct: async (_: any, { productId }: { productId: string }) => {
      return await Review.find({ productId })
    },
  },

  Mutation: {
    createProduct: async (_: any, { input }: { input: any }) => await Product.create(input),
    updateProduct: async (_: any, { id, input }: { id: string, input: any }) =>
      await Product.findByIdAndUpdate(id, input, { new: true }),
    deleteProduct: async (_: any, { id }: { id: string }) => {
      const result = await Product.findByIdAndDelete(id)
      return !!result
    },
    addReview: async (_: any, { input }: { input: any }) => {
      return await Review.create(input)
    },
  },
}

// Fungsi bantu untuk hitung rata-rata rating
async function getAverageRating(productId: string): Promise<number> {
  const reviews = await Review.find({ productId })
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  return total / reviews.length
}
