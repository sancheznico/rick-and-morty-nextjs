/* ======================================================
   CORE SHARED TYPES
====================================================== */

export type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
};

export type Episode = {
  id: string;
  name: string;
  episode: string;
  air_date?: string;
  characters?: Character[];
};

/* ======================================================
   CHARACTERS LIST (HOMEPAGE)
   - search (name)
   - filters (status, species)
   - sorting (A–Z / Z–A)
   - pagination
====================================================== */

export type CharactersData = {
  characters: {
    info: {
      next: number | null;
    };
    results: Character[];
  };
};

/* ======================================================
   CHARACTER DETAIL PAGE
====================================================== */

export type CharacterData = {
  character: {
    id?: string;
    name: string;
    image: string;
    status: string;
    species: string;
    episode: Episode[];
  } | null;
};

/* ======================================================
   EPISODES LIST PAGE
====================================================== */

export type EpisodesData = {
  episodes: {
    info: {
      next: number | null;
    };
    results: Episode[];
  };
};

/* ======================================================
   EPISODE DETAIL PAGE
====================================================== */

export type EpisodeData = {
  episode: {
    id: string;
    name: string;
    air_date: string;
    episode: string;
    characters: Character[];
  } | null;
};
