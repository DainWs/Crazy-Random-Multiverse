package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

class ClassicEventDispatcherTest {

	private static final int PLAYERS = 4;

	@Test
	void testGivenPlayerWithTurnSurrenderedWithOpponentsAlive_whenDispatchSurrender_thenTurnIsPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		game.getPlayerWithTurn().die();

		new ClassicEventDispatcher(gameFlow).dispatch(this.createSurrenderEvent(game));

		assertThat(gameFlow.nextTurnCount).isEqualTo(1);
	}

	@Test
	void testGivenPlayerWithTurnSurrenderedWithOneOpponentLeft_whenDispatchSurrender_thenTurnIsNotPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(2).build();
		game.getPlayerWithTurn().die();

		new ClassicEventDispatcher(gameFlow).dispatch(this.createSurrenderEvent(game));

		assertThat(gameFlow.nextTurnCount).isZero();
	}

	@Test
	void testGivenPlayerWithoutTurnIsDead_whenDispatchSurrender_thenTurnIsNotPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Player playerWithTurn = game.getPlayerWithTurn();
		game.getPlayers().stream().filter(player -> !player.equals(playerWithTurn)).findFirst().orElseThrow().die();

		new ClassicEventDispatcher(gameFlow).dispatch(this.createSurrenderEvent(game));

		assertThat(gameFlow.nextTurnCount).isZero();
	}

	private Event createSurrenderEvent(Game game) {
		return new Event(EventCode.PLAYER_SURRENDER, new EventDetails(game));
	}

	private static class RecordingGameFlow implements GameFlow {
		private int nextTurnCount;

		@Override
		public void onRestartGame(Game game) {
		}

		@Override
		public void onStartGame(Game game) {
		}

		@Override
		public void onEndGame(Game game) {
		}

		@Override
		public void onNextTurn(Game game) {
			this.nextTurnCount++;
		}

		@Override
		public void onPrevTurn(Game game) {
		}

		@Override
		public void updateGame(Game game) {
		}
	}
}
