"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
};

type CharactersData = {
  characters?: {
    info?: {
      next: number | null;
    };
    results: Character[];
  };
};

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
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortValue, setSortValue] = useState("none");

  const { data, loading, error } = useQuery<CharactersData>(
    GET_CHARACTERS,
    {
      variables: { page },
    }
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data?.characters?.results) return;

    setAllCharacters((prev) => {
      const newChars = data.characters!.results.filter(
        (c) => !prev.some((p) => p.id === c.id)
      );
      return [...prev, ...newChars];
    });
  }, [data]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !loading) {
          setIsFetching(true);
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      setIsFetching(false);
    }
  }, [loading]);

  if (error) return <p>Error loading characters</p>;

  let characters = allCharacters.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  characters = characters.filter((char) => {
    if (filterValue === "all") return true;
    if (filterValue === "alive") return char.status === "Alive";
    if (filterValue === "dead") return char.status === "Dead";
    if (filterValue === "unknown") return char.status === "unknown";
    return char.species === filterValue;
  });

  if (sortValue === "az") {
    characters = [...characters].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sortValue === "za") {
    characters = [...characters].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  const hasNextPage = data?.characters?.info?.next !== null;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Rick and Morty Characters</h1>

          <div className="controls">
            <select
              className="input-dark select"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="all">All Characters</option>

              <optgroup label="Status">
                <option value="alive">Alive</option>
                <option value="dead">Dead</option>
                <option value="unknown">Unknown</option>
              </optgroup>

              <optgroup label="Species">
                <option value="Human">Human</option>
                <option value="Alien">Alien</option>
                <option value="Robot">Robot</option>
                <option value="Humanoid">Humanoid</option>
              </optgroup>
            </select>

            <select
              className="input-dark select"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="none">Sort</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>

          <Link href="/episodes" className="episodes-link">
            View Episodes →
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search character..."
          className="input-dark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid">
        {characters.map((char) => (
          <div key={char.id} className="card fade-in">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={300}
            />

            <h3>
              <Link href={`/characters/${char.id}`}>
                {char.name}
              </Link>
            </h3>

            <p className="species-label">{char.species}</p>
          </div>
        ))}
      </div>

      {/* LOADER TRIGGER */}
      {hasNextPage && (
        <div ref={loadMoreRef} style={{ height: "30px" }}></div>
      )}

      {/* Hidden load button (kept for design consistency) */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button className="load-more" style={{ opacity: 0 }}>
          Load more characters
        </button>
      </div>

      {/* Loading indicator */}
      {isFetching && <p style={{ textAlign: "center" }}>Loading...</p>}
    </div>
  );
}
