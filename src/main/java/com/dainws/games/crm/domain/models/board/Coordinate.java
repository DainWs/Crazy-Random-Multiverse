package com.dainws.games.crm.domain.models.board;

import java.util.Objects;

public final class Coordinate {
	private int row;
	private int column;
	
	public Coordinate(int row, int column) {
		this.row = row;
		this.column = column;
	}
	
	public boolean isRow(int row) {
		return this.row == row;
	}

	public boolean isColumn(int column) {
		return this.column == column;
	}

	
	public int getRow() {
		return row;
	}
	
	public int getColumn() {
		return column;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		
		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}

		Coordinate that = (Coordinate) obj;
		boolean isSameRow = this.isRow(that.row);
		boolean isSameColumn = this.isColumn(that.column);
		return isSameRow && isSameColumn;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.row, this.column);
	}

	@Override
	public String toString() {
		return "[Row=%s,Column=%s]".formatted(this.row, this.column);
	}
}
