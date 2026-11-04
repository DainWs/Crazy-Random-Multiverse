type ResourceType = 'IMAGE' | 'AUDIO';

type GameResource = {
  key: string;
  type: ResourceType;
  url: string;
};

type ResourceManifest = {
  fixed: GameResource[];
  dynamic: GameResource[];
};

export type { ResourceType, GameResource, ResourceManifest }
