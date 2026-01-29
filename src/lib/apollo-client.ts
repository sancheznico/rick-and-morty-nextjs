import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getApolloClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "https://rickandmortyapi.com/graphql",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
