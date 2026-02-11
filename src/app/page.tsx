"use client";

import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

function Filters({
  name,
  status,
  species,
  sort,
}: {
  name: string;
  status: string;
  species: string;
  sort: string;
}) {
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const form = e.currentTarget.form;
    if (!form) return;
    const formData = new FormData(form);
    const query = new URLSearchParams(formData as any).toString();
    router.push(`/?${query}`);
  };

  return (
    <form
      className="topbar"
      style={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <div className="filter-bar" style={{ gap: "12px" }}>
        <select
          name="status"
          defaultValue={status}
          className="select"
          onChange={handleChange}
        >
          <option value="">Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          name="species"
          defaultValue={species}
          className="select"
          onChange={handleChange}
        >
          <option value="">Species</option>
          <option value="human">Human</option>
          <option value="alien">Alien</option>
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="select"
          onChange={handleChange}
        >
          <option value="">Sort</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Search character..."
        defaultValue={name}
        className="search"
        onChange={handleChange}
      />
    </form>
  );
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "";
  const status = searchParams.get("status") || "";
  const species = searchParams.get("species") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || 1);

  const [characters, setCharacters] = useState<
    CharactersData["characters"]["results"]
  >([]);
  const [nextPage, setNextPage] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCharacters() {
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

      if (!data) return;

      let results = [...data.characters.results];

      if (sort === "az") results.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "za") results.sort((a, b) => b.name.localeCompare(a.name));

      setCharacters(results);
      setNextPage(data.characters.info.next);
    }

    fetchCharacters();
  }, [name, status, species, sort, page]);

  return (
    <div className="page">
      <div className="topbar" style={{ justifyContent: "space-between", marginBottom: "20px" }}>
        <div className="title">
          <h1>Characters</h1>
        </div>

        {/* ✅ VIEW ALL EPISODES BUTTON */}
        <Link href="/episodes" className="btn">
          View All Episodes
        </Link>
      </div>

      {/* FILTERS + SEARCH */}
      <Filters name={name} status={status} species={species} sort={sort} />

      {/* GRID */}
      <div className="grid">
        {characters.map((char) => (
          <Link key={char.id} href={`/characters/${char.id}`} className="card">
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

      {/* LOAD MORE */}
      {nextPage && (
        <Link
          className="btn"
          href={`/?page=${nextPage}&name=${name}&status=${status}&species=${species}&sort=${sort}`}
        >
          Load More
        </Link>
      )}
    </div>
  );
}
