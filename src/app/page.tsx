import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

import { getApolloClient } from "@/lib/apollo-client";
import type { CharactersData } from "@/types/graphql";

const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int!
    $name: String
    $status: String
    $species: String
  ) {
    characters(
      page: $page
      filter: { name: $name, status: $status, species: $species }
    ) {
      info {
        next
      }
      results {
        id
        name
        image
        status
        species
      }
    }
  }
`;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    name?: string;
    status?: string;
    species?: string;
    sort?: string;
  }>;
}) {
  // ✅ unwrap async searchParams
  const params = (await searchParams) ?? {};

  const name = params.name ?? "";
  const status = params.status ?? "";
  const species = params.species ?? "";
  const sort = params.sort ?? "";
  const page = Number(params.page ?? 1);

  const client = getApolloClient();

  const { data } = await client.query<CharactersData>({
    query: GET_CHARACTERS,
    variables: {
      page,
      name: name || undefined,
      status: status || undefined,
      species: species || undefined,
    },
  });

  if (!data) {
    return <p>Failed to load characters.</p>;
  }

  // ✅ sorting (SSR-safe)
  let characters = [...data.characters.results];

  if (sort === "az") {
    characters.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "za") {
    characters.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="page">
      {/* ================= TOP BAR ================= */}
      <div className="topbar">
        <div className="title">
          <h1>Characters</h1>
        </div>

        {/* SEARCH (TOP RIGHT) */}
        <form method="GET" className="search-container">
          <input
            type="text"
            name="name"
            placeholder="Search character..."
            defaultValue={name}
            className="search"
          />
        </form>
      </div>

      {/* ================= FILTERS (LEFT) ================= */}
      <form method="GET" className="filter-bar">
  {/* preserve search */}
  <input type="hidden" name="name" value={name} />

  <select name="status" defaultValue={status} className="select">
    <option value="">Status</option>
    <option value="alive">Alive</option>
    <option value="dead">Dead</option>
    <option value="unknown">Unknown</option>
  </select>

  <select name="species" defaultValue={species} className="select">
    <option value="">Species</option>
    <option value="human">Human</option>
    <option value="alien">Alien</option>
  </select>

  <select name="sort" defaultValue={sort} className="select">
    <option value="">Sort</option>
    <option value="az">A–Z</option>
    <option value="za">Z–A</option>
  </select>

  {/* Invisible submit button (SSR-safe) */}
  <button type="submit" style={{ display: "none" }} aria-hidden />
</form>


      {/* ================= GRID ================= */}
      <div className="grid">
        {characters.map((char) => (
          <Link
            key={char.id}
            href={`/characters/${char.id}`}
            className="card"
          >
            <Image
              src={char.image}
              alt={char.name}
              width={200}
              height={200}
              className="avatar"
              loading="eager"
            />
            <div className="name">{char.name}</div>
            <div className="meta">
              {char.status} – {char.species}
            </div>
          </Link>
        ))}
      </div>

      {/* ================= LOAD MORE ================= */}
      {data.characters.info.next && (
        <Link
          className="btn"
          href={`/?page=${data.characters.info.next}&name=${name}&status=${status}&species=${species}&sort=${sort}`}
        >
          Load More
        </Link>
      )}
    </div>
  );
}
