package com.dainws.games.cbg.domain.player;

import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ZoneTest {
	Zone zone;

	@BeforeEach
	void beforeEach() {
		this.zone = new Zone();
	}

	@Test
	void testGivenPosition_whenCanPutCombatantOnPosition_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenNotEmptyPosition_whenCanPutCombatantOnPosition_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenPositionOfFrontLine_whenCanPutCombatantOnPositionAndBackLineIsFull_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenPositionOfFrontLine_whenCanPutCombatantOnPositionAndBackLineIsNotFull_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenLinePositionThatHasAllSquaresWithCombatants_whenIsLineFull_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenLinePositionThatHasNotAllSquaresWithCombatants_whenIsLineFull_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenLinePositionThatHasAllSquaresWithoutCombatants_whenIsLineEmpty_thenReturnTrue() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenLinePositionThatHasNotAllSquaresWithoutCombatants_whenIsLineEmpty_thenReturnFalse() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenCombatantAndPosition_whenPutCombatant_thenSetCombatantInPosition() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenCombatantAndNotEmptyPosition_whenPutCombatant_thenThrowPlayerException() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenZoneWithCombatantAtPositionX_whenGetCombatantFrom_thenReturnCombatantInPositionX() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenZoneWithoutCombatantAtPositionX_whenGetCombatant_thenThrowPlayerException() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenZoneWithCombatantAtPositionX_whenRemoveCombatant_thenDoNotThrowPlayerException() {
		fail("Not yet implemented");
	}

	@Test
	void testGivenZoneWithoutCombatantAtPositionX_whenRemoveCombatant_thenDoNotThrowPlayerException() {
		fail("Not yet implemented");
	}
}
