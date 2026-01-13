"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";

type Character = {
  id: string;
  name: string;
  image: string;
};

type CharactersData = {
  characters: {
    results: Character[];
  };
};

const GET_CHARACTERS = gql`
  query {
    characters(page: 1) {
      results {
        id
        name
        image
      }
    }
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading characters</p>;

  // Filter characters by name
  const filteredCharacters = data.characters.results.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Rick and Morty Characters</h1>

      {/* Episodes link */}
      <div style={{ textAlign: "center", margin: "10px 0 20px" }}>
        <Link href="/episodes">View Episodes →</Link>
      </div>

      {/* Search input */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search character..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
      </div>

      {/* Characters grid */}
      <div className="grid">
        {filteredCharacters.map((char) => (
          <div key={char.id} className="card">
            <img src={char.image} alt={char.name} />
            <h3>
              <Link href={`/characters/${char.id}`}>{char.name}</Link>
            </h3>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredCharacters.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No characters found.
        </p>
      )}
    </div>
  );
}
