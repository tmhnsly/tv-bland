export type EpisodeImage = {
  original?: string;
};

export type Episode = {
  show: {
    id: number;
    name: string;
    rating: { average: number };
    image: EpisodeImage;
  };
};
