import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "@/lib/apollo-client";
import type { CharactersData } from "@/types/graphql";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        next
      }
      results {
        id
        name
        image
        status
        species
      }
    }
  }
`;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const client = getApolloClient();

  const result = await client.query<CharactersData>({
    query: GET_CHARACTERS,
    variables: { page },
  });

  const data = result.data;

  // ✅ REQUIRED GUARD
  if (!data) {
    return <p>Failed to load characters.</p>;
  }

  return (
    <div className="page">
      <h1>Characters</h1>

      <div className="grid">
        {data.characters.results.map((char) => (
          <Link
            key={char.id}
            href={`/characters/${char.id}`}
            className="card"
          >
            <Image
              src={char.image}
              alt={char.name}
              width={200}
              height={200}
            />
            <h3>{char.name}</h3>
            <p>
              {char.status} – {char.species}
            </p>
          </Link>
        ))}
      </div>

      {data.characters.info.next && (
        <Link href={`/?page=${data.characters.info.next}`} className="btn">
          Load More
        </Link>
      )}
    </div>
  );
}
