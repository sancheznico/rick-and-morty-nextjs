"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

type Episode = {
  id: string;
  name: string;
  episode: string;
};

type EpisodesData = {
  episodes: {
    results: Episode[];
  };
};

const GET_EPISODES = gql`
  query {
    episodes(page: 1) {
      results {
        id
        name
        episode
      }
    }
  }
`;

export default function EpisodesPage() {
  const { data, loading, error } = useQuery<EpisodesData>(GET_EPISODES);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading episodes</p>;

  return (
    <div>
      <h1>Episodes</h1>
      {data.episodes.results.map((ep) => (
        <div key={ep.id}>
          <Link href={`/episodes/${ep.id}`}>
            {ep.name} ({ep.episode})
          </Link>
        </div>
      ))}
    </div>
  );
}
