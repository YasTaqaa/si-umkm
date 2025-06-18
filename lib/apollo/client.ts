// lib/apollo/client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: '/api/graphql', // ✅ HARUS cocok dengan route di app/api/graphql/route.ts
  cache: new InMemoryCache(),
})

export default client
