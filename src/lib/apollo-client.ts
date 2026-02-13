"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

let client: ApolloClient;

export function getApolloClient() {
  if (!client) {
    client = new ApolloClient({
      link: new HttpLink({
        uri: "https://rickandmortyapi.com/graphql",
      }),
      cache: new InMemoryCache(),
    });
  }

  return client;
}
