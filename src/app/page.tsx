"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

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

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading characters</p>;

  return (
    <div className="container">
      {/* Title */}
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Rick and Morty Characters
      </h1>

      {/* Episodes link UNDER the title */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link
          href="/episodes"
          className="card"
          style={{
            display: "inline-block",
            padding: "10px 20px",
          }}
        >
          View Episodes →
        </Link>
      </div>

      {/* Characters grid */}
      <div className="grid">
        {data.characters.results.map((char) => (
          <div key={char.id} className="card">
            <img src={char.image} alt={char.name} />
            <h3>
              <Link href={`/characters/${char.id}`}>{char.name}</Link>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
