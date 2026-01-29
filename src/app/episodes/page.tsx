import { gql } from "@apollo/client";
import Link from "next/link";

import { getApolloClient } from "@/lib/apollo-client";
import type { EpisodesData } from "@/types/graphql";

const GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        next
      }
      results {
        id
        name
        episode
      }
    }
  }
`;

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const client = getApolloClient();

  const result = await client.query<EpisodesData>({
    query: GET_EPISODES,
    variables: { page },
  });

  const data = result.data;

  // ✅ Type-safe guard
  if (!data) {
    return <p>Failed to load episodes.</p>;
  }

  return (
    <div className="page">
      <header className="topbar title-center">
        <h1>Episodes</h1>
      </header>

      <Link href="/" className="nav-link">
        ← Back to Characters
      </Link>

      <div className="grid">
        {data.episodes.results.map((ep) => (
          <div key={ep.id} className="card">
            <Link href={`/episodes/${ep.id}`}>
              <h3>{ep.episode}</h3>
              <p>{ep.name}</p>
            </Link>
          </div>
        ))}
      </div>

      {data.episodes.info.next && (
        <Link
          href={`/episodes?page=${data.episodes.info.next}`}
          className="btn"
        >
          Load More
        </Link>
      )}
    </div>
  );
}
