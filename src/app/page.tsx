"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Character, CharactersData } from "@/types/graphql";

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

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  const { data, loading, error } = useQuery<CharactersData>(
    GET_CHARACTERS,
    { variables: { page } }
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const results = data?.characters?.results ?? [];
    setCharacters((prev) => {
      const ids = new Set(prev.map((c) => c.id));
      return [...prev, ...results.filter((c) => !ids.has(c.id))];
    });
  }, [data]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setIsFetching(true);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!loading) setIsFetching(false);
  }, [loading]);

  if (error) return <p className="error">Error loading characters</p>;

  const statusOptions = useMemo(
    () => Array.from(new Set(characters.map((c) => c.status))),
    [characters]
  );

  const speciesOptions = useMemo(
    () => Array.from(new Set(characters.map((c) => c.species))),
    [characters]
  );

  let visibleCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  visibleCharacters = visibleCharacters.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (speciesFilter !== "all" && c.species !== speciesFilter) return false;
    return true;
  });

  if (sortOrder === "az") {
    visibleCharacters.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortOrder === "za") {
    visibleCharacters.sort((a, b) => b.name.localeCompare(a.name));
  }

  const hasNext = data?.characters?.info?.next !== null;

  return (
    <div className="page">
      {/* HEADER */}
      <header className="topbar">
  <div className="title title-center">
    <h1>Rick & Morty</h1>
    <p>Characters</p>
  </div>
</header>

      {/* VIEW EPISODES — ABOVE FILTERS */}
      <div className="episodes-link-row">
        <Link href="/episodes" className="nav-link">
          View Episodes →
        </Link>
      </div>

      {/* SEARCH UPPER RIGHT */}
      <div className="search-container">
        <input
          className="search"
          placeholder="Search character..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
        >
          <option value="all">All Species</option>
          {speciesOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* CHARACTER GRID */}
      <div className="grid">
        {visibleCharacters.map((char) => (
          <div key={char.id} className="card">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={300}
              className="avatar"
            />
            <h3 className="name">
              <Link href={`/characters/${char.id}`}>{char.name}</Link>
            </h3>
            <p className="meta">
              {char.species} • {char.status}
            </p>
          </div>
        ))}
      </div>

      {hasNext && <div ref={loadMoreRef} className="load-ref" />}
      {isFetching && <p className="loading">Loading more...</p>}
    </div>
  );
}
