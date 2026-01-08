"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Episode = {
  id: string;
  name: string;
};

type CharacterData = {
  character: {
    name: string;
    image: string;
    status: string;
    species: string;
    episode: Episode[];
  };
};

const GET_CHARACTER = gql`
  query ($id: ID!) {
    character(id: $id) {
      name
      image
      status
      species
      episode {
        id
        name
      }
    }
  }
`;

export default function CharacterPage() {
  const params = useParams();
  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading character</p>;

  return (
    <div className="container">
      <h1>{data.character.name}</h1>
      <div className="card" style={{ width: "250px", margin: "20px auto" }}>
        <img src={data.character.image} alt={data.character.name} />
        <p>Status: {data.character.status}</p>
        <p>Species: {data.character.species}</p>
      </div>

      <h2>Episodes</h2>
      <div className="grid">
        {data.character.episode.map((ep) => (
          <div key={ep.id} className="card">
            <Link href={`/episodes/${ep.id}`}>{ep.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
