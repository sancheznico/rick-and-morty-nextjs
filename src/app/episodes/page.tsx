"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Episode = {
  id: string;
  name: string;
  episode: string; // S01E01
};

type EpisodesData = {
  episodes: {
    info: {
      next: number | null;
    };
    results: Episode[];
  };
};

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

function formatEpisode(code: string) {
  const season = code.substring(1, 3);
  const ep = code.substring(4, 6);
  return `Season ${parseInt(season)} • Episode ${parseInt(ep)}`;
}

function getSeason(code: string) {
  return code.substring(1, 3); // "01", "02"
}

export default function EpisodesPage() {
  const [page, setPage] = useState(1);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("all");

  const { data, loading, error } = useQuery<EpisodesData>(
    GET_EPISODES,
    { variables: { page } }
  );

  /* =====================
     APPEND EPISODES (DEDUPED)
  ===================== */
  useEffect(() => {
    if (!data?.episodes?.results) return;

    setAllEpisodes((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newEpisodes = data.episodes.results.filter(
        (e) => !existingIds.has(e.id)
      );
      return [...prev, ...newEpisodes];
    });
  }, [data]);

  /* =====================
     LOAD MORE
  ===================== */
  const loadMore = () => {
    if (data?.episodes.info.next) {
      setPage(data.episodes.info.next);
    }
  };

  /* =====================
     FILTER + SEARCH
  ===================== */
  const filteredEpisodes = useMemo(() => {
    return allEpisodes.filter((ep) => {
      const matchSearch =
        ep.name.toLowerCase().includes(search.toLowerCase());

      const matchSeason =
        season === "all" || getSeason(ep.episode) === season;

      return matchSearch && matchSeason;
    });
  }, [allEpisodes, search, season]);

  if (error) return <p>Error loading episodes</p>;

  return (
    <div className="container fade-in">
      {/* BACK BUTTON */}
      <Link href="/" className="back-button">
        ← Back to Characters
      </Link>

      {/* HEADER */}
      <div className="header">
        <h1>Episodes</h1>

        {/* SEARCH + FILTER */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="search"
            placeholder="Search episode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="search"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="all">All Seasons</option>
            <option value="01">Season 1</option>
            <option value="02">Season 2</option>
            <option value="03">Season 3</option>
            <option value="04">Season 4</option>
            <option value="05">Season 5</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {filteredEpisodes.map((ep) => (
          <div key={ep.id} className="card episode-card">
            <h3>
              <Link href={`/episodes/${ep.id}`}>
                {formatEpisode(ep.episode)}
              </Link>
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>{ep.name}</p>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {data?.episodes.info.next && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button className="load-more" onClick={loadMore}>
            Load more episodes
          </button>
        </div>
      )}

      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}
    </div>
  );
}
