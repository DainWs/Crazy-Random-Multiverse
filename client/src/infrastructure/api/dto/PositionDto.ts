class PositionDto {
  public row: number;
  public column: number;

  public constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}

export default PositionDto;
