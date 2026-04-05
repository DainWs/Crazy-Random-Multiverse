package com.dainws.games.crm.controller.dto.domain;

public class PositionDto {
	private int row;
	private int column;

	public void setRow(int row) {
		this.row = row;
	}
	
	public int getRow() {
		return row;
	}
	
	public void setColumn(int column) {
		this.column = column;
	}
	
	public int getColumn() {
		return column;
	}
	
	@Override
	public String toString() {
		return this.row+"_"+this.column;
	}
}
