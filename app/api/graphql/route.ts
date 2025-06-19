// app/api/graphql/route.ts
import { NextRequest } from 'next/server'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs, resolvers } from '@/graphql/schema'
import { connectDB } from '@/lib/db/connectDB'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    await connectDB()
    return { req }
  },
})

export const GET = handler
export const POST = handler
