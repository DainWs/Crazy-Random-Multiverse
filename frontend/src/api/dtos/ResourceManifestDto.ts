import type { GameResource, ResourceManifest, ResourceType } from "@/domain/Resources";

interface ResourceDto {
  key: string;
  type: ResourceType;
  url: string;
}

interface ResourceManifestDto {
  fixed: ResourceDto[];
  dynamic: ResourceDto[];
}

const toResourceManifest = (dto: ResourceManifestDto): ResourceManifest => {
  return {
    fixed: dto.fixed.map(toGameResource),
    dynamic: dto.dynamic.map(toGameResource)
  };
};

function toGameResource(dto: ResourceDto): GameResource {
  return {
    key: dto.key,
    type: dto.type,
    url: dto.url
  };
}

export type { ResourceDto, ResourceManifestDto }
export { toResourceManifest }
