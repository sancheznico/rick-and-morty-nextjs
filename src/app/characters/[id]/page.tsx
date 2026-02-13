"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

type Episode = {
  id: string;
  name: string;
  episode: string;
};

type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  episode: Episode[];
};

type CharacterResponse = {
  character: Character;
};

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
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
  const id = params.id as string;

  const { data, loading, error } = useQuery<CharacterResponse>(
    GET_CHARACTER,
    {
      variables: { id },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading character.</p>;
  if (!data?.character) return <p>Character not found.</p>;

  const character = data.character;

  return (
    <div className="page">
      <Link href="/" className="nav-link">
        ← Back to Characters
      </Link>

      <div className="character-detail">
        <div className="profile-card">
          <Image
            src={character.image}
            alt={character.name}
            width={300}
            height={300}
            className="avatar-big"
          />
          <h1>{character.name}</h1>

          <div className="profile-meta">
            <p><strong>Status:</strong> {character.status}</p>
            <p><strong>Species:</strong> {character.species}</p>
          </div>
        </div>

        <div className="episodes-card">
          <h2>Episodes Appeared In</h2>

          <div className="episodes-list">
            {character.episode.map((ep: Episode) => (
              <div key={ep.id} className="episode-item">
                <Link href={`/episodes/${ep.id}`}>
                  <strong>{ep.episode}</strong>
                  <p>{ep.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
