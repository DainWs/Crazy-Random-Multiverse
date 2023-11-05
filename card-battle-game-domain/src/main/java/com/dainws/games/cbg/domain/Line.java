package com.dainws.games.cbg.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class Line {
	private LinePosition linePosition;
	private Map<SquarePosition, Square> squares;

	public Line(LinePosition linePosition) {
		this.linePosition = linePosition;
		this.squares = new EnumMap<>(SquarePosition.class);

		for (SquarePosition squarePosition : SquarePosition.values()) {
			Position position = new Position(linePosition, squarePosition);
			this.squares.put(squarePosition, new Square(position));
		}
	}

	public boolean isFull() {
		boolean isFull = true;
		
		for (Square square : this.squares.values()) {
			if (!square.hasCombatant()) {
				isFull = false;
			}
		}
		
		return isFull;
	}
	
	public boolean isEmpty() {
		boolean isEmpty = true;
		
		for (Square square : this.squares.values()) {
			if (square.hasCombatant()) {
				isEmpty = false;
			}
		}
		
		return isEmpty;
	}
	
	public boolean isLinePosition(LinePosition linePosition) {
		return this.linePosition.equals(linePosition);
	}

	public Square getSquareFrom(Position position) {
		return this.squares.get(position.getSquarePosition());
	}

	public List<Square> getSquares() {
		List<Square> linesList = new ArrayList<>(this.squares.values());
		return Collections.unmodifiableList(linesList);
	}

	public LinePosition getLinePosition() {
		return linePosition;
	}
}
