package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

class ClassicEventDispatcherTest {

	private static final int PLAYERS = 4;

	@Test
	void testGivenPlayerWithTurnDiedWithOpponentsAlive_whenDispatchPlayerDie_thenTurnIsPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		game.getPlayerWithTurn().die();

		ClassicEventDispatcher dispatcher = new ClassicEventDispatcher(gameFlow);
		Event event = this.createPlayerDieEvent(game);

		dispatcher.dispatch(event);

		assertThat(gameFlow.getNextTurnCount()).isEqualTo(1);
	}

	@Test
	void testGivenPlayerWithTurnDiedWithOneOpponentLeft_whenDispatchPlayerDie_thenTurnIsNotPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(2).build();
		game.getPlayerWithTurn().die();

		ClassicEventDispatcher dispatcher = new ClassicEventDispatcher(gameFlow);
		Event event = this.createPlayerDieEvent(game);

		dispatcher.dispatch(event);

		assertThat(gameFlow.getNextTurnCount()).isZero();
	}

	@Test
	void testGivenPlayerWithoutTurnIsDead_whenDispatchPlayerDie_thenTurnIsNotPassed() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Player playerWithTurn = game.getPlayerWithTurn();
		game.getPlayers() //
				.stream() //
				.filter(player -> !player.equals(playerWithTurn)) //
				.findFirst() //
				.orElseThrow() //
				.die();

		ClassicEventDispatcher dispatcher = new ClassicEventDispatcher(gameFlow);
		Event event = this.createPlayerDieEvent(game);

		dispatcher.dispatch(event);

		assertThat(gameFlow.getNextTurnCount()).isZero();
	}

	@Test
	void testGivenSurrender_whenDispatchSurrender_thenSurrenderedPlayerIsEliminated() {
		RecordingGameFlow gameFlow = new RecordingGameFlow();
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Player surrendered = game.getPlayerWithTurn();
		EventDetails details = new EventDetails(game);
		details.setSourcePlayer(surrendered);
		Event event = new Event(EventCode.PLAYER_SURRENDER, details);
		ClassicEventDispatcher dispatcher = new ClassicEventDispatcher(gameFlow);

		dispatcher.dispatch(event);

		assertThat(gameFlow.getEliminatedPlayers()).containsExactly(surrendered);
	}

	private Event createPlayerDieEvent(Game game) {
		return new Event(EventCode.PLAYER_DIE, new EventDetails(game));
	}
}
