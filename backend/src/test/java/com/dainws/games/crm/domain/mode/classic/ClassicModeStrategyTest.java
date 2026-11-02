package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

class ClassicModeStrategyTest {

	private static final long SEED = 7L;
	private static final int PLAYERS = 4;

	@Test
	void testGivenSeededRandom_whenCreateTurn_thenPlayerWithTurnIsTheOneDrawn() {
		PlayerStorage players = this.createPlayers();
		ClassicModeStrategy strategy = new ClassicModeStrategy(null, null);
		strategy.setRandom(new Random(SEED));
		int expectedIndex = new Random(SEED).nextInt(PLAYERS);

		Turn turn = strategy.createTurn(players);

		assertThat(turn.getTurnNumber()).isEqualTo(expectedIndex);
	}

	@Test
	void testGivenAnyPlayers_whenCreateTurn_thenRoundIsTheStartingOne() {
		ClassicModeStrategy strategy = new ClassicModeStrategy(null, null);
		strategy.setRandom(new Random(SEED));

		Turn turn = strategy.createTurn(this.createPlayers());

		assertThat(turn.getRoundNumber()).isEqualTo(ClassicModeStrategy.STARTING_ROUND);
	}

	private PlayerStorage createPlayers() {
		return new PlayerStorage(List.of(
				new PlayerBuilder().build(), new PlayerBuilder().build(),
				new PlayerBuilder().build(), new PlayerBuilder().build()));
	}
}
