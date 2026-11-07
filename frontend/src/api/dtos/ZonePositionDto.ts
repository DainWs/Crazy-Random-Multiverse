import Position, { ZonePosition } from "@/domain/Position";

interface ZonePositionDto {
  row: number;
  column: number;
}

/** The contract numbers the rows from the leader towards the center (CON-14) and the frontend the other way round (VIEW-1), so the conversion is its own inverse. */
function mirrorRow(row: number, rowCount: number): number {
  return rowCount - 1 - row;
}

function toPositionDto(pos: Position, rowCount: number): ZonePositionDto | undefined {
  if (typeof pos !== 'object' || !pos) return undefined;

  return {
    row: mirrorRow(pos.row, rowCount),
    column: pos.column
  };
}

function toZonePosition(dto: ZonePositionDto): ZonePosition {
  return new ZonePosition(dto.row, dto.column);
}

export type { ZonePositionDto };
export { mirrorRow, toPositionDto, toZonePosition };
