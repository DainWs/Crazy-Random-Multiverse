type HandPosition = number;

class ZonePosition {
  public row: number;
  public column: number;

  public constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}

type Position = HandPosition | ZonePosition;

export type { HandPosition, ZonePosition }
export default Position;
