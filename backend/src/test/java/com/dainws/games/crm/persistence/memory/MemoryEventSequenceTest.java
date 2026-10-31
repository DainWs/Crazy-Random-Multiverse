package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.GameCode;

class MemoryEventSequenceTest {

	@Test
	void testGivenNewGame_whenNext_thenSequenceStartsAtOne() {
		MemoryEventSequence eventSequence = new MemoryEventSequence();

		assertThat(eventSequence.next(new GameCode())).isEqualTo(1);
	}

	@Test
	void testGivenSameGame_whenNextTwice_thenSequenceIncreases() {
		MemoryEventSequence eventSequence = new MemoryEventSequence();
		GameCode gameCode = new GameCode();

		eventSequence.next(gameCode);

		assertThat(eventSequence.next(gameCode)).isEqualTo(2);
	}

	@Test
	void testGivenAnotherGame_whenNext_thenSequenceIsIndependent() {
		MemoryEventSequence eventSequence = new MemoryEventSequence();
		eventSequence.next(new GameCode());

		assertThat(eventSequence.next(new GameCode())).isEqualTo(1);
	}
}
