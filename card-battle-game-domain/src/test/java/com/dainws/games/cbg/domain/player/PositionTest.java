package com.dainws.games.cbg.domain.player;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PositionTest {
	LinePosition testLinePosition;
	SquarePosition testSquarePosition;
	Position position;

	@BeforeEach
	void beforeEach() {
		this.testLinePosition = LinePosition.FRONT;
		this.testSquarePosition = SquarePosition.LEFT;
		this.position = new Position(this.testLinePosition, this.testSquarePosition);
	}

	@Test
	void testGivenSameLinePosition_whenIsFromLinePosition_thenReturnTrue() {
		LinePosition sameLinePosition = this.testLinePosition;

		boolean result = this.position.isFrom(sameLinePosition);

		assertTrue(result);
	}

	@Test
	void testGivenDifferentLinePosition_whenIsFromLinePosition_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;

		boolean result = this.position.isFrom(otherLinePosition);

		assertFalse(result);
	}

	@Test
	void testGivenSameSquarePosition_whenIsFromSquarePosition_thenReturnTrue() {
		SquarePosition sameSquarePosition = this.testSquarePosition;

		boolean result = this.position.isFrom(sameSquarePosition);

		assertTrue(result);
	}

	@Test
	void testGivenDifferentSquarePosition_whenIsFromSquarePosition_thenReturnFalse() {
		SquarePosition otherSquarePosition = SquarePosition.CENTER;

		boolean result = this.position.isFrom(otherSquarePosition);

		assertFalse(result);
	}


	@Test
	void testGivenPositionWithDifferentLinePosition_whenEquals_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;
		Position otherPosition = new Position(otherLinePosition, this.testSquarePosition);

		boolean result = this.position.equals(otherPosition);

		assertFalse(result);
	}

	@Test
	void testGivenPositionWithDifferentSquarePosition_whenEquals_thenReturnFalse() {
		SquarePosition otherSquarePosition = SquarePosition.CENTER;
		Position otherPosition = new Position(this.testLinePosition, otherSquarePosition);

		boolean result = this.position.equals(otherPosition);

		assertFalse(result);
	}

	@Test
	void testGivenSamePosition_whenEquals_thenReturnTrue() {
		Position thatPosition = new Position(this.testLinePosition, this.testSquarePosition);

		boolean result = this.position.equals(thatPosition);

		assertTrue(result);
	}
}
