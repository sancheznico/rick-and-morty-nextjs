"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import type { EpisodeData } from "@/types/graphql";

import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

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

export default function EpisodePage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<EpisodeData>(
    GET_EPISODE,
    { variables: { id } }
  );

  // ⬇️ SAFE render logic
  let content = null;
  if (loading) content = <Loading />;
  if (error) content = <ErrorState />;

  if (content) return content;

  const episode = data?.episode;
  if (!episode) return <EmptyState text="Episode not found." />;

  return (
    <div className="page">
      <header className="topbar">
        <div className="title">
          <h1>{episode.episode}</h1>
          <p>{episode.name}</p>
        </div>

        <Link href="/episodes" className="nav-link">
          ← Back
        </Link>
      </header>

      <div className="info">
        <p><strong>Air Date:</strong> {episode.air_date}</p>
        <p><strong>Characters:</strong> {episode.characters?.length ?? 0}</p>
      </div>

      <div className="grid">
        {(episode.characters ?? []).map((char) => (
          <div key={char.id} className="card">
            <Image src={char.image} alt={char.name} width={300} height={300} className="avatar" />
            <Link href={`/characters/${char.id}`} className="name-link">
              {char.name}
            </Link>
          </div>
        ))}
      </div>

      {!loading && (episode.characters ?? []).length === 0 && (
        <EmptyState text="No characters found in this episode." />
      )}
    </div>
  );
}
