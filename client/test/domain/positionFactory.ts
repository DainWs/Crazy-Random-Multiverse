import Position, { ZonePosition } from "@/domain/models/Position";

const createPosition = (row?: number, column?: number): Position => {
  if (!row) row = Math.floor(Math.random() * 3) + 1;
  if (!column) column = Math.floor(Math.random() * 3) + 1;
  return new ZonePosition(row, column);
}

export default {
  createPosition
}