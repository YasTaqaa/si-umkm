/* eslint-disable @typescript-eslint/no-explicit-any */
// graphql/schema.ts
import { gql } from 'graphql-tag'
import Product from '@/models/product'

export const typeDefs = gql`
  type Product {
    _id: ID!
    nama: String!
    kategori: String!
    harga: Int!
  }

  type Query {
    searchProduct(keyword: String!): [Product!]!
    getAllProducts: [Product!]!
    getProductById(id: ID!): Product
  }

  input ProductInput {
    nama: String!
    kategori: String!
    harga: Int!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`

export const resolvers = {
  Query: {
    searchProduct: async (_: any, { keyword }: { keyword: string }) => {
      const regex = new RegExp(keyword, 'i')
      return await Product.find({ nama: { $regex: regex } })
    },
    getAllProducts: async () => {
      return await Product.find()
    },
    getProductById: async (_: any, { id }: { id: string }) => {
      return await Product.findById(id)
    },
  },

  Mutation: {
    createProduct: async (_: any, { input }: { input: any }) => {
      return await Product.create(input)
    },
    updateProduct: async (_: any, { id, input }: { id: string, input: any }) => {
      return await Product.findByIdAndUpdate(id, input, { new: true })
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
      const result = await Product.findByIdAndDelete(id)
      return !!result
    },
  },
}
