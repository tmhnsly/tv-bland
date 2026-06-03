export type ShowImage = {
  medium?: string;
  original?: string;
};

// The common entity rendered by ShowCard / ShowGrid across the home schedule,
// search results, genre browsing and a person's credits.
export type Show = {
  id: number;
  name: string;
  genres?: string[];
  rating: { average: number | null };
  image?: ShowImage | null;
  summary?: string | null;
  premiered?: string | null;
  status?: string;
  network?: { name: string } | null;
};

// An individual episode as returned by `/shows/{id}?embed[]=episodes`.
export type SeasonEpisode = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate?: string;
  airtime?: string;
  runtime?: number | null;
  rating?: { average: number | null };
  summary?: string | null;
  image?: ShowImage | null;
};
