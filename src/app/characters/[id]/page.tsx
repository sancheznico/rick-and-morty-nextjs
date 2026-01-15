"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Episode = {
  id: string;
  name: string;
  episode: string;
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
        episode
      }
    }
  }
`;

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id },
  });

  const ITEMS_PER_LOAD = 5;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !data) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        visibleCount < data.character.episode.length
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_LOAD, data.character.episode.length)
        );
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [data, visibleCount]);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading character</p>;

  const episodes = data.character.episode.slice(0, visibleCount);

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

      <div className="character-page">
        {/* Character Card */}
        <div className="character-card">
          <Image
            src={data.character.image}
            alt={data.character.name}
            width={300}
            height={300}
            className="character-image"
            priority
          />
          <h1>{data.character.name}</h1>
          <p><strong>Status:</strong> {data.character.status}</p>
          <p><strong>Species:</strong> {data.character.species}</p>
        </div>

        {/* Episodes Card */}
        <div className="episodes-card">
          <h2>Episodes</h2>

          <div className="episodes-list">
            {episodes.map((ep) => (
              <div key={ep.id} className="episode-item">
                <Link href={`/episodes/${ep.id}`}>
                  <strong>{ep.episode}</strong> — {ep.name}
                </Link>
              </div>
            ))}

            {visibleCount < data.character.episode.length && (
              <div ref={loadMoreRef} className="load-trigger" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
