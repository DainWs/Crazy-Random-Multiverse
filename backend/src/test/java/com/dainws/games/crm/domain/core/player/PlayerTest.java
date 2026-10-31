package com.dainws.games.crm.domain.core.player;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.AIPlayerBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;

class PlayerTest {

	@Test
	void testGivenAlivePlayer_whenDie_thenPlayerIsNotAlive() {
		Player player = new PlayerBuilder().build();

		player.die();

		assertThat(player.isAlive()).isFalse();
	}

	@Test
	void testGivenAlivePlayer_whenDie_thenPlayerIsSpectator() {
		Player player = new PlayerBuilder().build();

		player.die();

		assertThat(player.isSpectator()).isTrue();
	}

	@Test
	void testGivenAIPlayer_whenDie_thenPlayerIsSpectator() {
		Player player = AIPlayerBuilder.basicAIPlayer();

		player.die();

		assertThat(player.isSpectator()).isTrue();
	}

	@Test
	void testGivenNewPlayer_whenCreated_thenPlayerIsAliveAndNotSpectator() {
		Player player = new PlayerBuilder().build();

		assertThat(player.isAlive()).isTrue();
		assertThat(player.isSpectator()).isFalse();
	}
}
