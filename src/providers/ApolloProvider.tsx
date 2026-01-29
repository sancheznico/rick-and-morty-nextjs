"use client";

import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "../lib/apollo-client";

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = getApolloClient(); // ✅ new instance
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
