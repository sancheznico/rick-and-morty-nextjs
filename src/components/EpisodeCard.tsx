import Link from "next/link";
import type { Episode } from "@/types/graphql";

type Props = {
  episode: Episode;
};

export default function EpisodeCard({ episode }: Props) {
  return (
    <div className="card">
      <Link href={`/episodes/${episode.id}`} className="episode-link">
        <h3>{episode.episode}</h3>
        <p>{episode.name}</p>
      </Link>
    </div>
  );
}
