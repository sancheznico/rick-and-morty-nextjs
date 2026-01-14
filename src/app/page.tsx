"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Character = {
  id: string;
  name: string;
  image: string;
  species: string; // changed from status
};

type CharactersData = {
  characters: {
    results: Character[];
  };
};

// GraphQL query updated to fetch species instead of status
const GET_CHARACTERS = gql`
  query GetCharacters($status: String) {
    characters(page: 1, filter: { status: $status }) {
      results {
        id
        name
        image
        species
      }
    }
  }
`;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS, {
    variables: { status },
  });

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading characters</p>;

  const filteredCharacters = data.characters.results.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        {/* LEFT: Title + Filter Buttons */}
        <div>
          <h1>Rick and Morty Characters</h1>

          <div className="filters">
            <button
              className={!status ? "active" : ""}
              onClick={() => setStatus(null)}
            >
              All
            </button>
            <button
              className={status === "Alive" ? "active" : ""}
              onClick={() => setStatus("Alive")}
            >
              Alive
            </button>
            <button
              className={status === "Dead" ? "active" : ""}
              onClick={() => setStatus("Dead")}
            >
              Dead
            </button>
            <button
              className={status === "unknown" ? "active" : ""}
              onClick={() => setStatus("unknown")}
            >
              Unknown
            </button>
          </div>
        </div>

        {/* RIGHT: Search + View Episodes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search character..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link href="/episodes" className="episodes-link">
            View Episodes →
          </Link>
        </div>
      </div>

      {/* GRID OF CHARACTERS */}
      <div className="grid">
        {filteredCharacters.map((char) => (
          <div key={char.id} className="card fade-in">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={300}
              className="card-image"
            />
            <h3>
              <Link href={`/characters/${char.id}`}>{char.name}</Link>
            </h3>
            <p style={{ fontSize: "13px", opacity: 0.85 }}>{char.species}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
