package com.dainws.games.cbg.domain.player;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlayerCodeTest {
	
	PlayerCode playerCode;
	
	@BeforeEach
	void beforeEach() {
		String code = "Th1s1s4Un1qu3C0d3";
		this.playerCode = PlayerCode.from(code);
	}
	
	@Test
	void testGivenPlayerCodeWithDifferentCode_whenEquals_thenReturnFalse() {
		PlayerCode otherPlayerCode = PlayerCode.from("ThisIsOtherUniqueCode");
		
		boolean result = this.playerCode.equals(otherPlayerCode);
		
		assertFalse(result);
	}

	@Test
	void testGivenPlayerCodeWithSameCode_whenEquals_thenReturnTrue() {
		PlayerCode thatPlayerCode = this.playerCode;
		
		boolean result = this.playerCode.equals(thatPlayerCode);
		
		assertTrue(result);
	}
	
	@Test
	void testGivenNullCode_whenNewInstance_thenThrowNullPointerException() {
		String nullCode = null;
		
		assertThrows(NullPointerException.class, () -> PlayerCode.from(nullCode));
	}
	
	@Test
	void testGivenCode_whenNewInstance_thenDoNotThrowException() {
		String code = "ThisIsOneCode";
		
		assertDoesNotThrow(() -> PlayerCode.from(code));
	}
}
