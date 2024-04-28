class PositionDto {
    public row: Number;
    public column: Number;

    public constructor(row: Number, column: Number) {
        this.row = row;
        this.column = column;
    }
};

export default PositionDto;