type Resource = {
  id: string;
  path: string;
};

type CardResource = {
  code: string
  name: string;
  description: string;
  imagePath: string;
  audios: Resource[];
}

type GameResources = {
  images: Resource[];
  audios: Resource[];
  cards: CardResource[];
};

export type { Resource, CardResource, GameResources }