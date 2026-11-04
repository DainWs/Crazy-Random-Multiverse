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

const toGameResource = (dto: ResourceDto): GameResource => ({
  key: dto.key,
  type: dto.type,
  url: dto.url
});

const toResourceManifest = (dto: ResourceManifestDto): ResourceManifest => ({
  fixed: dto.fixed.map(toGameResource),
  dynamic: dto.dynamic.map(toGameResource)
});

export type { ResourceDto, ResourceManifestDto }
export { toResourceManifest }
