package com.dainws.games.cbg.domain.player;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorFactory;
import com.dainws.games.cbg.domain.exception.CardNotFoundException;
import com.dainws.games.cbg.domain.exception.PositionNotEmptyException;

class SquareTest {

	Position testPosition;
	Square square;

	@BeforeEach
	void beforeEach() {
		LinePosition testLinePosition = LinePosition.FRONT;
		SquarePosition testSquarePosition = SquarePosition.LEFT;
		this.testPosition = new Position(testLinePosition, testSquarePosition);
		this.square = new Square(this.testPosition);
	}

	@Test
	void testGivenSquareWithWarrior_whenHasWarrior_thenReturnTrue() throws PositionNotEmptyException {
		Warrior warrior = new WarriorFactory().createBasicWarrior();
		this.square.putCombatant(warrior);

		boolean result = this.square.hasCombatant();

		assertTrue(result);
	}

	@Test
	void testGivenSquareWithoutWarrior_whenHasWarrior_thenReturnFalse() {
		this.square.removeCombatant();

		boolean result = this.square.hasCombatant();

		assertFalse(result);
	}

	@Test
	void testGivenDifferentPosition_whenIsPosition_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;
		SquarePosition otherSquarePosition = SquarePosition.CENTER;
		Position otherPosition = new Position(otherLinePosition, otherSquarePosition);

		boolean result = this.square.isPosition(otherPosition);

		assertFalse(result);
	}

	@Test
	void testGivenSamePosition_whenIsPosition_thenReturnTrue() {
		boolean result = this.square.isPosition(this.testPosition);

		assertTrue(result);
	}

	@Test
	void testGivenWarriorAndEmptySquare_whenPutCombatant_thenSquareHasWarrior() throws PositionNotEmptyException {
		this.square.removeCombatant();
		Warrior warrior = new WarriorFactory().createBasicWarrior();

		this.square.putCombatant(warrior);

		assertTrue(this.square.hasCombatant());
	}

	@Test
	void testGivenWarriorAndEmptySquare_whenPutCombatant_thenDoNotThrowException() {
		this.square.removeCombatant();
		Warrior warrior = new WarriorFactory().createBasicWarrior();

		assertDoesNotThrow(() -> this.square.putCombatant(warrior));
	}

	@Test
	void testGivenWarriorAndFilledSquare_whenPutCombatant_thenThrowSquareAlreadyFilledException() throws PositionNotEmptyException {
		WarriorFactory warriorFactory = new WarriorFactory();
		Warrior warrior = warriorFactory.createBasicWarrior();
		this.square.removeCombatant();
		this.square.putCombatant(warriorFactory.createBasicWarrior());

		assertThrows(PositionNotEmptyException.class, () -> this.square.putCombatant(warrior));
	}

	@Test
	void testGivenFilledSquare_whenRemoveWarrior_thenSquareIsNotFilled() throws PositionNotEmptyException {
		this.square.putCombatant(new WarriorFactory().createBasicWarrior());

		this.square.removeCombatant();

		assertFalse(this.square.hasCombatant());
	}
	
	@Test
	void testGivenSquareWithWarrior_whenGetWarrior_thenDoesNotThrowException() throws PositionNotEmptyException {
		Warrior warrior = new WarriorFactory().createBasicWarrior();
		this.square.putCombatant(warrior);

		assertDoesNotThrow(() -> this.square.getCombatant());
	}

	@Test
	void testGivenSquareWithoutWarrior_whenGetWarrior_thenThrowNoSuchCardException() {
		this.square.removeCombatant();

		assertThrows(CardNotFoundException.class, () -> this.square.getCombatant());
	}

	@Test
	void testGivenSquareWithDifferentPosition_whenEquals_thenReturnFalse() {
		LinePosition otherLinePosition = LinePosition.BACK;
		SquarePosition otherSquarePosition = SquarePosition.CENTER;
		Position otherPosition = new Position(otherLinePosition, otherSquarePosition);
		Square thatSquare = new Square(otherPosition);

		boolean result = this.square.equals(thatSquare);

		assertFalse(result);
	}

	@Test
	void testGivenSquareWithSamePosition_whenEquals_thenReturnTrue() {
		Square thatSquare = new Square(this.testPosition);

		boolean result = this.square.equals(thatSquare);

		assertTrue(result);
	}
}
