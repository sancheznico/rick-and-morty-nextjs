"use client";

import { gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);
    const query = new URLSearchParams(formData as any).toString();

    // Push to URL without reloading
    window.history.pushState(null, "", `/?${query}`);
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <form
      className="topbar"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <div
        className="filter-bar"
        style={{ display: "flex", gap: "12px", alignItems: "center" }}
      >
        {/* Status Filter */}
        <select name="status" defaultValue={status} className="select" onChange={handleChange}>
          <option value="">Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        {/* Species Filter */}
        <select name="species" defaultValue={species} className="select" onChange={handleChange}>
          <option value="">Species</option>
          <option value="human">Human</option>
          <option value="alien">Alien</option>
          <option value="humanoid">Humanoid</option>
          <option value="poopybutthole">Poopybutthole</option>
          <option value="mythological">Mythological</option>
          <option value="unknown">Unknown</option>
          <option value="animal">Animal</option>
          <option value="robot">Robot</option>
          <option value="cronenberg">Cronenberg</option>
          <option value="disease">Disease</option>
          <option value="planet">Planet</option>
        </select>

        {/* Sort */}
        <select name="sort" defaultValue={sort} className="select" onChange={handleChange}>
          <option value="">Sort</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      {/* Search */}
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

  const name = searchParams.get("name") || "";
  const status = searchParams.get("status") || "";
  const species = searchParams.get("species") || "";
  const sort = searchParams.get("sort") || "";

  const [characters, setCharacters] = useState<CharactersData["characters"]["results"]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);

  const fetchCharacters = async (page: number, append = false) => {
    setLoading(true);
    const client = getApolloClient();
    const { data } = await client.query<CharactersData>({
      query: GET_CHARACTERS,
      variables: {
        page,
        name: name || undefined,
        status: status || undefined,
        species: species || undefined,
      },
      fetchPolicy: "cache-first",
    });

    if (data) {
      let results = [...data.characters.results];
      if (sort === "az") results.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "za") results.sort((a, b) => b.name.localeCompare(a.name));

      setCharacters((prev) => (append ? [...prev, ...results] : results));
      setNextPage(data.characters.info.next);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCharacters(1, false);
  }, [name, status, species, sort]);

  const handleLoadMore = () => {
    if (nextPage) {
      fetchCharacters(nextPage, true);
    }
  };

  return (
    <div className="page">
      {/* Top bar with title and "View All Episodes" */}
      <div className="topbar" style={{ justifyContent: "space-between" }}>
        <h1>Characters</h1>
        <Link href="/episodes" className="btn">
          View All Episodes
        </Link>
      </div>

      {/* Filters + Search */}
      <Filters name={name} status={status} species={species} sort={sort} />

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Characters Grid */}
      <div className="grid">
        {characters.map((char) => (
          <Link key={char.id} href={`/characters/${char.id}`} className="card">
            <Image src={char.image} alt={char.name} width={200} height={200} />
            <div className="name">{char.name}</div>
            <div className="meta">{char.status} – {char.species}</div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {nextPage && !loading && (
        <button className="btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}
