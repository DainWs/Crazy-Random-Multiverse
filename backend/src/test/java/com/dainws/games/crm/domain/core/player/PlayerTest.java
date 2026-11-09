package com.dainws.games.crm.domain.core.player;

import static org.assertj.core.api.Assertions.assertThat;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

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

	// SPEC-3
	@Test
	void testGivenSpectator_whenLeave_thenPlayerHasLeft() {
		Player player = new PlayerBuilder().build();
		player.die();

		player.leave();

		assertThat(player.hasLeft()).isTrue();
	}

	// SPEC-3
	@Test
	void testGivenPlayerWhoIsNotSpectator_whenLeave_thenFails() {
		Player player = new PlayerBuilder().build();

		assertThrows(IllegalStateException.class, player::leave);
	}

	@Test
	void testGivenNewPlayer_whenCreated_thenPlayerIsAlive() {
		Player player = new PlayerBuilder().build();

		assertThat(player.isAlive()).isTrue();
	}

	@Test
	void testGivenNewPlayer_whenCreated_thenPlayerIsNotSpectator() {
		Player player = new PlayerBuilder().build();

		assertThat(player.isSpectator()).isFalse();
	}
}
