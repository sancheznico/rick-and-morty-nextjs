"use client";

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://rickandmortyapi.com/graphql",
  credentials: "same-origin",
});

const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});

export function getApolloClient() {
  return client;
}
