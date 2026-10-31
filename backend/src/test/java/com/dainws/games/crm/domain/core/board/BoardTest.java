package com.dainws.games.crm.domain.core.board;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.player.Player;

public class BoardTest {

	@Test
	void testGivenPlayer_whenSetZone_thenZoneIsNotEnemyOfThatPlayer() {
		Player player = new PlayerBuilder().withCode("player").build();
		Board board = new Board(List.of());

		board.setZone(player, new DummyZone());

		assertThat(board.getZoneOf(player).isEnemy(player)).isFalse();
	}

	@Test
	void testGivenBoardWithTwoPlayers_whenCreated_thenZoneIsNotEnemyOfItsOwner() {
		Player player = new PlayerBuilder().withCode("player").build();
		Player other = new PlayerBuilder().withCode("other").build();

		Board board = new Board(DummyZone::new, List.of(player, other));

		assertThat(board.getZoneOf(player).isEnemy(player)).isFalse();
	}

	@Test
	void testGivenBoardWithTwoPlayers_whenCreated_thenZoneIsEnemyOfTheOtherPlayer() {
		Player player = new PlayerBuilder().withCode("player").build();
		Player other = new PlayerBuilder().withCode("other").build();

		Board board = new Board(DummyZone::new, List.of(player, other));

		assertThat(board.getZoneOf(player).isEnemy(other)).isTrue();
	}
}
