package com.dainws.games.crm.domain.models.player;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PositionTest {
	LinePosition testLinePosition;
	SquarePosition testSquarePosition;
	Coordinate coordinate;

	@BeforeEach
	void beforeEach() {
		this.testLinePosition = LinePosition.FRONT;
		this.testSquarePosition = SquarePosition.LEFT;
		this.coordinate = new Coordinate(this.testLinePosition, this.testSquarePosition);
	}

	@Test
	void testGivenSameLinePosition_whenIsFromLinePosition_thenReturnTrue() {
		LinePosition sameLinePosition = this.testLinePosition;

		boolean result = this.coordinate.isFrom(sameLinePosition);

		assertTrue(result);
	}

	@Test
	void testGivenDifferentLinePosition_whenIsFromLinePosition_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;

		boolean result = this.coordinate.isFrom(otherLinePosition);

		assertFalse(result);
	}

	@Test
	void testGivenSameSquarePosition_whenIsFromSquarePosition_thenReturnTrue() {
		SquarePosition sameSquarePosition = this.testSquarePosition;

		boolean result = this.coordinate.isFrom(sameSquarePosition);

		assertTrue(result);
	}

	@Test
	void testGivenDifferentSquarePosition_whenIsFromSquarePosition_thenReturnFalse() {
		SquarePosition otherSquarePosition = SquarePosition.CENTER;

		boolean result = this.coordinate.isFrom(otherSquarePosition);

		assertFalse(result);
	}


	@Test
	void testGivenPositionWithDifferentLinePosition_whenEquals_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;
		Coordinate otherPosition = new Coordinate(otherLinePosition, this.testSquarePosition);

		boolean result = this.coordinate.equals(otherPosition);

		assertFalse(result);
	}

	@Test
	void testGivenPositionWithDifferentSquarePosition_whenEquals_thenReturnFalse() {
		SquarePosition otherSquarePosition = SquarePosition.CENTER;
		Coordinate otherPosition = new Coordinate(this.testLinePosition, otherSquarePosition);

		boolean result = this.coordinate.equals(otherPosition);

		assertFalse(result);
	}

	@Test
	void testGivenSamePosition_whenEquals_thenReturnTrue() {
		Coordinate thatPosition = new Coordinate(this.testLinePosition, this.testSquarePosition);

		boolean result = this.coordinate.equals(thatPosition);

		assertTrue(result);
	}
}
