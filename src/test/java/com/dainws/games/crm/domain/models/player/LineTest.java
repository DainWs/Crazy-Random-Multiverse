package com.dainws.games.crm.domain.models.player;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LineTest {
	LinePosition testLinePosition;
	Line line;

	@BeforeEach
	void beforeEach() {
		this.testLinePosition = LinePosition.FRONT;

		this.line = new Line(this.testLinePosition);
	}

	@Test
	void testGivenDifferentLinePosition_whenIsLinePosition_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;

		boolean result = this.line.isLinePosition(otherLinePosition);

		assertFalse(result);
	}

	@Test
	void testGivenSameLinePosition_whenIsLinePosition_thenReturnTrue() {
		LinePosition thatLinePosition = this.testLinePosition;

		boolean result = this.line.isLinePosition(thatLinePosition);

		assertTrue(result);
	}

	@Test
	void testGivenPositionWithSameLinePosition_whenGetSquareFromPosition_thenReturnSquareWithSamePosition() {
		SquarePosition thatSquarePosition = SquarePosition.CENTER;
		Coordinate coordinate = new Coordinate(this.testLinePosition, thatSquarePosition);

		Square square = this.line.getSquareFrom(coordinate);

		assertTrue(square.isPosition(coordinate));
	}
}
