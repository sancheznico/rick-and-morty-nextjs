"use client"; // ← must be first line

import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import Link from "next/link";

import { getApolloClient } from "@/lib/apollo-client";
import type { EpisodesData } from "@/types/graphql";

const GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info { next }
      results { id name episode }
    }
  }
`;

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<EpisodesData["episodes"]["results"]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);

  const fetchEpisodes = async (page: number, append = false) => {
    setLoading(true);
    const client = getApolloClient();
    const { data } = await client.query<EpisodesData>({
      query: GET_EPISODES,
      variables: { page },
      fetchPolicy: "cache-first",
    });

    if (data) {
      setEpisodes(prev => append ? [...prev, ...data.episodes.results] : data.episodes.results);
      setNextPage(data.episodes.info.next);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpisodes(1, false); // fetch first page on mount
  }, []);

  return (
    <div className="page">
      <Link href="/" className="nav-link">
        ← Back to Characters
      </Link>

      <h1>Episodes</h1>

      {loading && <p>Loading...</p>}

      <div className="grid">
        {episodes.map(ep => (
          <Link key={ep.id} href={`/episodes/${ep.id}`} className="card">
            <h3>{ep.episode}</h3>
            <p>{ep.name}</p>
          </Link>
        ))}
      </div>

      {nextPage && !loading && (
        <button className="btn" onClick={() => fetchEpisodes(nextPage, true)}>
          Load More
        </button>
      )}
    </div>
  );
}
