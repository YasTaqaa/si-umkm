// app/api/graphql/route.ts
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { typeDefs, resolvers } from '@/graphql/schema'
import { connectDB } from '@/lib/db/connectDB'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    await connectDB()
    return {}
  },
})

export { handler as GET, handler as POST }
