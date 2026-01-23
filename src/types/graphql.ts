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
};

export type CharactersData = {
  characters?: {
    info?: {
      next: number | null;
    };
    results?: Character[];
  };
};

export type CharacterData = {
  character?: {
    name?: string;
    image?: string;
    status?: string;
    species?: string;
    episode?: Episode[];
  };
};

export type EpisodeData = {
  episode?: {
    name?: string;
    air_date?: string;
    episode?: string;
    characters?: Character[];
  };
};

export type EpisodesData = {
  episodes?: {
    info?: {
      next: number | null;
    };
    results?: Episode[];
  };
};
