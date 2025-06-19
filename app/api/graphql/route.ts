// app/api/graphql/route.ts
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { typeDefs, resolvers } from '@/graphql/schema'
import { connectDB } from '@/lib/db/connectDB'
import { NextRequest } from 'next/server'

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

export { handler as GET, handler as POST }
