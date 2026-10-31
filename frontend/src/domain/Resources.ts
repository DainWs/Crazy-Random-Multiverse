import { CardType } from "@/domain/Card";

type Resource = {
  id: string;
  path: string;
};

type CardResource = {
  code: string;
  type: CardType;
  name: string;
  description: string;
  image: Resource;
  audios: Resource[];
}

type GameResources = {
  images: Resource[];
  audios: Resource[];
  cards: CardResource[];
};

export type { Resource, CardResource, GameResources }