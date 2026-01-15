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
  status: string;
  species: string;
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
        status
        species
      }
    }
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortValue, setSortValue] = useState("none");

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading characters</p>;

  let characters = data.characters.results.filter((char) =>
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

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        {/* LEFT */}
        <div>
          <h1>Rick and Morty Characters</h1>

          <div className="controls">
            {/* FILTER */}
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

            {/* SORT */}
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

          {/* VIEW EPISODES */}
          <Link href="/episodes" className="episodes-link">
            View Episodes →
          </Link>
        </div>

        {/* RIGHT */}
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
          <div key={char.id} className="card">
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

            <p className="species-label">
              {char.species}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
