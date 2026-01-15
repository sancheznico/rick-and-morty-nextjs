"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
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

function formatEpisode(code: string) {
  const season = code.substring(1, 3);
  const ep = code.substring(4, 6);
  return `Season ${parseInt(season)} • Episode ${parseInt(ep)}`;
}

export default function EpisodesPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery<EpisodesData>(GET_EPISODES);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading episodes</p>;

  return (
    <div className="container fade-in">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          borderRadius: "8px",
          background: "#1f1f1f",
          border: "none",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1>Episodes</h1>

      <div className="grid">
        {data.episodes.results.map((ep) => (
          <div key={ep.id} className="card">
            <h3>
              <Link href={`/episodes/${ep.id}`}>
                {formatEpisode(ep.episode)}
              </Link>
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>{ep.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
