package com.dainws.games.crm.console.controllers.dto;

import java.util.EnumMap;
import java.util.Map;

import com.dainws.games.cbg.domain.player.LinePosition;
import com.dainws.games.cbg.domain.player.SquarePosition;

public class LineDto {
	private LinePosition linePosition;
	private Map<SquarePosition, SquareDto> squares;
	
	public LineDto(LinePosition linePosition) {
		this.linePosition = linePosition;
		this.squares = new EnumMap<>(SquarePosition.class);
	}
	
	public void add(SquareDto squareDto) {
		this.squares.put(squareDto.getSquarePosition(), squareDto);
	}
	
	public int getCellWidth() {
		int cellWidth = this.linePosition.name().length();
		
		for (SquareDto squareDto : this.squares.values()) {
			if (squareDto != null && squareDto.getCellWidth() > cellWidth) {
				cellWidth = squareDto.getCellWidth();
			}
		}
		
		return cellWidth;
	}
	
	public LinePosition getLinePosition() {
		return linePosition;
	}

	public String toString(int cellWidth, String cellDelimiter) {
		int cellCount = 4;
		String cellWildcard = "%-"+cellWidth+"s"+cellDelimiter;
		String emptyCell = " ".repeat(cellWidth)+cellDelimiter;

		StringBuilder nameBuilder = new StringBuilder().append(emptyCell);
		StringBuilder typeBuilder = new StringBuilder().append(emptyCell);
		StringBuilder damageBuilder = new StringBuilder()
				.append(cellWildcard.formatted(this.linePosition.name()));
		StringBuilder healthBuilder = new StringBuilder().append(emptyCell);
		StringBuilder armorBuilder = new StringBuilder().append(emptyCell);
		StringBuilder descriptionBuilder = new StringBuilder().append(emptyCell);

		for (SquareDto squareDto : this.squares.values()) {
			nameBuilder.append(cellWildcard.formatted(squareDto.getCombatantName()));
			typeBuilder.append(cellWildcard.formatted(squareDto.getCombatantType()));
			damageBuilder.append(cellWildcard.formatted(squareDto.getCombatantDamage()));
			healthBuilder.append(cellWildcard.formatted(squareDto.getCombatantHealth()));
			armorBuilder.append(cellWildcard.formatted(squareDto.getCombatantArmor()));
			descriptionBuilder.append(cellWildcard.formatted(squareDto.getCombatantDescription()));
		}

		return new StringBuilder()
			.append(emptyCell.repeat(cellCount)).append("\n")
			.append(nameBuilder).append("\n")
			.append(emptyCell.repeat(cellCount)).append("\n")
			.append(typeBuilder).append("\n")
			.append(emptyCell.repeat(cellCount)).append("\n")
			.append(damageBuilder).append("\n")
			.append(healthBuilder).append("\n")
			.append(armorBuilder).append("\n")
			.append(emptyCell.repeat(cellCount)).append("\n")
			.append(descriptionBuilder).append("\n")
			.append(emptyCell.repeat(cellCount)).append("\n")
			.toString();
	}
}
