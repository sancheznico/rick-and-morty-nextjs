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
  searchParams?: {
    page?: string;
    name?: string;
    status?: string;
    species?: string;
    sort?: string;
  };
}) {
  const page = Number(searchParams?.page ?? 1);
  const name = searchParams?.name ?? "";
  const status = searchParams?.status ?? "";
  const species = searchParams?.species ?? "";
  const sort = searchParams?.sort ?? "";

  const client = getApolloClient();

  const result = await client.query<CharactersData>({
    query: GET_CHARACTERS,
    variables: {
      page,
      name: name || null,     // 🔍 SEARCH BY NAME
      status: status || null,
      species: species || null,
    },
  });

  const data = result.data;

  // ✅ REQUIRED TYPE-SAFE GUARD
  if (!data || !data.characters || !data.characters.results) {
    return <p>Failed to load characters.</p>;
  }

  let characters = data.characters.results;

  // ✅ SORT (SERVER SIDE)
  if (sort === "name-asc") {
    characters = [...characters].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sort === "name-desc") {
    characters = [...characters].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <div className="page">
      {/* TOP BAR */}
      <div className="topbar">
        <div className="title">
          <h1>Characters</h1>
          <p>Rick & Morty Universe</p>
        </div>

        {/* 🔍 SEARCH (PRESS ENTER) */}
        <form method="get" className="search-container">
          <input
            className="search"
            type="text"
            name="name"
            placeholder="Search character..."
            defaultValue={name}
          />

          {/* keep filters when searching */}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="species" value={species} />
          <input type="hidden" name="sort" value={sort} />
        </form>
      </div>

      {/* FILTER LINKS (SSR-SAFE) */}
      <div className="filter-bar">
        <Link href={`/?status=alive&name=${name}`}>Alive</Link>
        <Link href={`/?status=dead&name=${name}`}>Dead</Link>
        <Link href={`/?status=unknown&name=${name}`}>Unknown</Link>

        <Link href={`/?species=Human&name=${name}`}>Human</Link>
        <Link href={`/?species=Alien&name=${name}`}>Alien</Link>

        <Link href={`/?sort=name-asc&name=${name}`}>A–Z</Link>
        <Link href={`/?sort=name-desc&name=${name}`}>Z–A</Link>
      </div>

      {/* GRID */}
      <div className="grid">
        {characters.map((char) => (
          <Link key={char.id} href={`/characters/${char.id}`} className="card">
            <Image
              src={char.image}
              alt={char.name}
              width={300}
              height={300}
              className="avatar"
            />
            <div className="name">{char.name}</div>
            <div className="meta">
              {char.status} – {char.species}
            </div>
          </Link>
        ))}
      </div>

      {/* LOAD MORE */}
      {data.characters.info.next && (
        <Link
          className="btn"
          href={{
            pathname: "/",
            query: {
              page: data.characters.info.next,
              name,
              status,
              species,
              sort,
            },
          }}
        >
          Load More
        </Link>
      )}
    </div>
  );
}
  