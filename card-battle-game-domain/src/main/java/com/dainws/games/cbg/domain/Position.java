package com.dainws.games.cbg.domain;

import java.util.Objects;

public final class Position {
	public static final Position LEADER_POSITION = new Position(LinePosition.LEADER, SquarePosition.CENTER);

	private final LinePosition linePosition;
	private final SquarePosition squarePosition;

	public Position(LinePosition linePosition, SquarePosition squarePosition) {
		this.linePosition = linePosition;
		this.squarePosition = squarePosition;
	}

	public boolean isFrom(LinePosition linePosition) {
		return this.linePosition.equals(linePosition);
	}

	public boolean isFrom(SquarePosition squarePosition) {
		return this.squarePosition.equals(squarePosition);
	}

	public LinePosition getLinePosition() {
		return linePosition;
	}

	public SquarePosition getSquarePosition() {
		return squarePosition;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || obj.getClass() != this.getClass())
			return false;

		Position that = (Position) obj;
		boolean isLinePositionEquals = this.linePosition.equals(that.linePosition);
		boolean isSquarePositionEquals = this.squarePosition.equals(that.squarePosition);
		return isLinePositionEquals && isSquarePositionEquals;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.linePosition, this.squarePosition);
	}

	@Override
	public String toString() {
		return "[Line=%s,Square=%s]".formatted(this.linePosition, this.squarePosition);
	}
}
