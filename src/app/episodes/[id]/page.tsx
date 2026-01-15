"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Character = {
  id: string;
  name: string;
  image: string;
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
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      name
      air_date
      episode
      characters {
        id
        name
        image
      }
    }
  }
`;

function formatEpisode(code: string) {
  const season = code.substring(1, 3);
  const ep = code.substring(4, 6);
  return `Season ${parseInt(season)} • Episode ${parseInt(ep)}`;
}

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();

  const { data, loading, error } = useQuery<EpisodeData>(
    GET_EPISODE,
    { variables: { id: params.id } }
  );

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading episode</p>;

  return (
    <div className="container fade-in">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          borderRadius: "8px",
          background: "#1f1f1f",
          border: "none",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h1>{formatEpisode(data.episode.episode)}</h1>
      <p><strong>{data.episode.name}</strong></p>
      <p>Air Date: {data.episode.air_date}</p>

      <h2 style={{ marginTop: "30px" }}>Characters</h2>

      <div className="grid">
        {data.episode.characters.map((char) => (
          <div key={char.id} className="card">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={300}
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
