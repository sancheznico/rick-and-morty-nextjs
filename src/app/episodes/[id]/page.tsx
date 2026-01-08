"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Character = {
  id: string;
  name: string;
};

type EpisodeData = {
  episode: {
    name: string;
    air_date: string;
    episode: string;
    characters: Character[];
  };
};

const GET_EPISODE = gql`
  query ($id: ID!) {
    episode(id: $id) {
      name
      air_date
      episode
      characters {
        id
        name
      }
    }
  }
`;

export default function EpisodePage() {
  const params = useParams();
  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading episode</p>;

  return (
    <div className="container">
      <h1>{data.episode.name}</h1>
      <p>Air Date: {data.episode.air_date}</p>
      <p>Episode: {data.episode.episode}</p>

      <h2>Characters</h2>
      <div className="grid">
        {data.episode.characters.map((char) => (
          <div key={char.id} className="card">
            <Link href={`/characters/${char.id}`}>{char.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
