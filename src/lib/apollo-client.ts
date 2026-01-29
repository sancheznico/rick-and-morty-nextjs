// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Named export, SSR safe
export function getApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://rickandmortyapi.com/graphql",
    }),
    cache: new InMemoryCache(),
  });
}
