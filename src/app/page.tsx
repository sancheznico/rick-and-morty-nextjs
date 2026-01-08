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
    <div>
      <h1>Characters</h1>
      {data.characters.results.map((char) => (
        <div key={char.id}>
          <img src={char.image} width={150} />
          <h3>
            <Link href={`/characters/${char.id}`}>{char.name}</Link>
          </h3>
        </div>
      ))}
      <Link href="/episodes">Go to Episodes</Link>
    </div>
  );
}
