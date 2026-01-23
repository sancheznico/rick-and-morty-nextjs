"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { EpisodesData, Episode } from "@/types/graphql";

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

export default function EpisodesPage() {
  const [page, setPage] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchText, setSearchText] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");

  const { data, loading, error } = useQuery<EpisodesData>(
    GET_EPISODES,
    { variables: { page } }
  );

  useEffect(() => {
    const results = data?.episodes?.results ?? [];
    setEpisodes((prev) => {
      const ids = new Set(prev.map((e) => e.id));
      return [...prev, ...results.filter((e) => !ids.has(e.id))];
    });
  }, [data]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      const matchSearch = ep.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchSeason =
        seasonFilter === "all" || ep.episode.substring(1, 3) === seasonFilter;

      return matchSearch && matchSeason;
    });
  }, [episodes, searchText, seasonFilter]);

  if (error) return <p className="error">Error loading episodes</p>;

  return (
    <div className="page">
      {/* CENTERED TITLE */}
      <header className="topbar">
        <div className="title title-center">
          <h1>Rick & Morty</h1>
            <p>Episodes</p>

        </div>
      </header>

      {/* BACK TO CHARACTERS ABOVE FILTERS */}
      <div className="episodes-link-row">
        <Link href="/" className="nav-link">
          ← Back to Characters
        </Link>
      </div>

      {/* SEARCH + FILTER ROW */}
      <div className="filters-search-row">
        {/* SEARCH RIGHT */}
        <div className="search-container">
          <input
            className="search"
            placeholder="Search episodes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* FILTER LEFT */}
        <div className="filter-bar">
          <select
            className="select"
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
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
          <div key={ep.id} className="card">
            <Link href={`/episodes/${ep.id}`} className="episode-link">
              <h3>{ep.episode}</h3>
              <p>{ep.name}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* LOAD MORE BUTTON CENTER */}
      {data?.episodes?.info?.next && (
        <button
          className="btn"
          onClick={() => setPage(data.episodes!.info!.next!)}
        >
          Load more episodes
        </button>
      )}

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}
