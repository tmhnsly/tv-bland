export type CastMemberImage = {
  medium: string;
  original: string;
};

export type CastMember = {
  person: {
    name: string;
    image: CastMemberImage;
    url: string;
  };
  character: {
    name: string;
    url: string;
  };
};
