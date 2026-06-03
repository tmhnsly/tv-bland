export type CastMemberImage = {
  medium: string;
};

export type CastMember = {
  person: {
    id: number;
    name: string;
    image: CastMemberImage;
    url: string;
  };
  character: {
    name: string;
    url: string;
  };
};
