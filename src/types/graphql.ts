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

export type CharactersData = {
  characters: {
    info: {
      next: number | null;
    };
    results: Character[];
  };
};
