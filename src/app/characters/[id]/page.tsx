"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { CharacterData } from "@/types/graphql";

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      name
      image
      status
      species
      episode {
        id
        name
        episode
      }
    }
  }
`;

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, { variables: { id } });

  const episodes = data?.character?.episode ?? [];
  const [visibleCount, setVisibleCount] = useState(8);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCount < episodes.length) {
        setVisibleCount((prev) => prev + 8);
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [episodes.length, visibleCount]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error || !data?.character) return <p className="error">Error loading character</p>;

  const character = data.character;

  return (
    <div className="page">
      <header className="topbar">
        <div className="title">
          <h1>{character.name}</h1>
          <p>{character.species} • {character.status}</p>
        </div>

        <Link href="/" className="nav-link">
          ← Back
        </Link>
      </header>

      <div className="character-detail">
        <div className="profile-card">
          <Image src={character.image ?? ""} alt={character.name ?? "Character"} width={300} height={300} className="avatar-big" />
          <div className="profile-meta">
            <p><strong>Status:</strong> {character.status}</p>
            <p><strong>Species:</strong> {character.species}</p>
          </div>
        </div>

        <div className="episodes-card">
          <h2>Episodes</h2>
          <div className="episodes-list">
            {episodes.slice(0, visibleCount).map((ep) => (
              <div key={ep.id} className="episode-item">
                <Link href={`/episodes/${ep.id}`}>
                  {ep.episode} — {ep.name}
                </Link>
              </div>
            ))}
            {visibleCount < episodes.length && <div ref={loadMoreRef} className="load-ref" />}
          </div>
        </div>
      </div>
    </div>
  );
}
