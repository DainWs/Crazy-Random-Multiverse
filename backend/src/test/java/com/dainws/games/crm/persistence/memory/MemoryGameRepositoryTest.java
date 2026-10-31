package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;

class MemoryGameRepositoryTest {

	private static final int GAMES = 200;
	private static final int PLAYERS = 2;

	@Test
	void testGivenSavesFromSeveralThreads_whenExists_thenEveryGameIsKept() {
		MemoryGameRepository repository = new MemoryGameRepository();
		List<Game> games = IntStream.range(0, GAMES) //
				.mapToObj(number -> new GameBuilder().withNRandomPlayers(PLAYERS).build()) //
				.toList();

		games.parallelStream().forEach(repository::save);

		boolean hasEveryGame = games.stream() //
				.allMatch(game -> repository.exists(game.getCode()));
		assertThat(hasEveryGame).isTrue();
	}

	@Test
	void testGivenNullCode_whenExists_thenIsFalse() {
		MemoryGameRepository repository = new MemoryGameRepository();

		assertThat(repository.exists(null)).isFalse();
	}
}
