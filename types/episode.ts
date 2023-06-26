export type EpisodeImage = {
  original?: string;
  medium?: string;
};

export type Episode = {
  show: {
    id: number;
    name: string;
    rating: { average: number };
    image: EpisodeImage;
  };
};
