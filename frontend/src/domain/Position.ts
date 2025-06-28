type NonePosition = null;

type HandPosition = number;

class ZonePosition {
  public row: number;
  public column: number;

  public constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}

type Position = NonePosition | HandPosition | ZonePosition;

export { ZonePosition };
export type { HandPosition };
export default Position;
