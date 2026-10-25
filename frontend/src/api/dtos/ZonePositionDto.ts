import Position, { ZonePosition } from "@/domain/Position";

interface ZonePositionDto {
  row: number;
  column: number;
}

function toPositionDto(pos: Position): ZonePositionDto | undefined {
  if (typeof pos !== 'object' || !pos) return undefined;

  return {
    row: pos.row,
    column: pos.column
  };
}

function toZonePosition(dto: ZonePositionDto): ZonePosition {
  return new ZonePosition(dto.row, dto.column);
}

export type { ZonePositionDto };
export { toPositionDto, toZonePosition };