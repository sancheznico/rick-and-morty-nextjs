import { gql } from "@apollo/client";
import Link from "next/link";

import { getApolloClient } from "@/lib/apollo-client";
import type { EpisodeData } from "@/types/graphql";

const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      id
      name
      episode
      characters {
        id
        name
      }
    }
  }
`;

export default async function EpisodePage({
  params,
}: {
  params: { id: string };
}) {
  const client = getApolloClient();

  const result = await client.query<EpisodeData>({
    query: GET_EPISODE,
    variables: { id: params.id },
  });

  const data = result.data;

  // ✅ Guard for data
  if (!data) return <p>Failed to load episode.</p>;

  const episode = data.episode;

  // ✅ Guard for episode
  if (!episode) return <p>Episode not found.</p>;

  return (
    <div className="page">
      <Link href="/episodes" className="nav-link">
        ← Back to Episodes
      </Link>

      <h1>{episode.episode}</h1>
      <h2>{episode.name}</h2>

      <h3>Characters</h3>
      <ul>
        {episode.characters.map((char) => (
          <li key={char.id}>
            <Link href={`/characters/${char.id}`}>{char.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
