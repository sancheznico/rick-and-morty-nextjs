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

  const { data } = await client.query<EpisodesData>({
    query: GET_EPISODES,
    variables: { page },
  });

  if (!data?.episodes) {
    return <p>Failed to load episodes.</p>;
  }

  return (
    <div className="page">
      <Link href="/" className="nav-link">
        ← Back to Characters
      </Link>

      <h1>Episodes</h1>

      <div className="grid">
        {data.episodes.results.map((ep) => (
          <Link key={ep.id} href={`/episodes/${ep.id}`} className="card">
            <h3>{ep.episode}</h3>
            <p>{ep.name}</p>
          </Link>
        ))}
      </div>

      {data.episodes.info.next && (
        <Link
          className="btn"
          href={`/episodes?page=${data.episodes.info.next}`}
        >
          Load More
        </Link>
      )}
    </div>
  );
}
