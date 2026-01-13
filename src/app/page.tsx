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

  const filteredCharacters = data.characters.results.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div>
          <h1>Rick and Morty Characters</h1>
          <Link href="/episodes" className="episodes-link">
            View Episodes →
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search character..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid">
        {filteredCharacters.map((char) => (
          <div key={char.id} className="card">
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
          </div>
        ))}
      </div>
    </div>
  );
}
