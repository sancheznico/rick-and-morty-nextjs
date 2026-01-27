import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/graphql";

type Props = {
  character: Character;
};

export default function CharacterCard({ character }: Props) {
  return (
    <div className="card">
      <Image
        src={character.image}
        alt={character.name}
        width={300}
        height={300}
        className="avatar"
      />
      <h3 className="name">
        <Link href={`/characters/${character.id}`}>
          {character.name}
        </Link>
      </h3>
      <p className="meta">
        {character.species} • {character.status}
      </p>
    </div>
  );
}
