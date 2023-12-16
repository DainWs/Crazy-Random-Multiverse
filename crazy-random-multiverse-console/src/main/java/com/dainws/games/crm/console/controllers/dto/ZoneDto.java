package com.dainws.games.crm.console.controllers.dto;

import java.util.EnumMap;
import java.util.Map;

import com.dainws.games.cbg.domain.player.LinePosition;

public class ZoneDto {
	private Map<LinePosition, LineDto> lines;
	
	public ZoneDto() {
		this.lines = new EnumMap<>(LinePosition.class);
	}
	
	public void addLine(LineDto lineDto) {
		this.lines.put(lineDto.getLinePosition(), lineDto);
	}
	
	private int getCellWidth() {
		int maxCellWidth = 0;

		for (LineDto lineDto : this.lines.values()) {
			int cellWidth = lineDto.getCellWidth();
			if (cellWidth > maxCellWidth) {
				maxCellWidth = cellWidth;
			}
		}
		
		return maxCellWidth;
	}
	
	@Override
	public String toString() {
		int cellWidth = this.getCellWidth();
		int cellCount = 4;
		String cellDelimiter = " # ";
		String rowDelimiter = "=".repeat(cellWidth + (cellDelimiter.length() * cellCount)) + "\n"; 
		
		return new StringBuilder()
			.append(rowDelimiter)
			.append(" Zone \n")
			.append(rowDelimiter)
			.append(this.lines.get(LinePosition.FRONT).toString(cellWidth, cellDelimiter))
			.append(rowDelimiter)
			.append(this.lines.get(LinePosition.BACK).toString(cellWidth, cellDelimiter))
			.append(rowDelimiter)
			.append(this.lines.get(LinePosition.LEADER).toString(cellWidth, cellDelimiter))
			.append(rowDelimiter)
			.toString();
	}
}
