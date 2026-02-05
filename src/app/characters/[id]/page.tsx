import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "@/lib/apollo-client";
import type { CharacterData } from "@/types/graphql";

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      episode {
        id
        name
        episode
      }
    }
  }
`;

export default async function CharacterPage({
  params,
}: {
  params: { id: string };
}) {
  const client = getApolloClient();

  const { data } = await client.query<CharacterData>({
    query: GET_CHARACTER,
    variables: { id: params.id },
  });

  if (!data?.character) {
    return <p>Character not found.</p>;
  }

  const character = data.character;

  return (
    <div className="page">
      <Link href="/" className="nav-link">
        ← Back to Characters
      </Link>

      <div className="character">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
        />
        <h1>{character.name}</h1>
        <p>
          {character.status} – {character.species}
        </p>
      </div>

      <h2>Episodes</h2>
      <ul>
        {character.episode.map((ep) => (
          <li key={ep.id}>
            <Link href={`/episodes/${ep.id}`}>
              {ep.episode} – {ep.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
