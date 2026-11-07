package com.dainws.games.crm.domain.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.domain.core.player.Player;

class GameLifeCycleTest {

	GameLifeCycle gameLifeCycle;
	EventPublisherMonitor eventMonitor;
	Player first;
	Player second;
	Game game;

	@BeforeEach
	void beforeEach() {
		this.gameLifeCycle = new GameLifeCycle();
		this.eventMonitor = new EventPublisherMonitor();
		this.first = new PlayerBuilder().build();
		this.second = new PlayerBuilder().build();
		this.game = new GameBuilder() //
				.withPlayers(this.first, this.second) //
				.withEventPublisher(this.eventMonitor) //
				.build();
		this.gameLifeCycle.register(this.game, player -> true);
		this.gameLifeCycle.startLoading(this.game);
	}

	@Test
	void testGivenLoadingGame_whenOnlyOnePlayerIsReady_thenGameKeepsLoading() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		assertThat(this.game.inStatus(Status.LOADING)).isTrue();
	}

	@Test
	void testGivenLoadingGame_whenEveryPlayerIsReady_thenGameIsInProgress() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());
		this.gameLifeCycle.loadCompleteFor(this.game, this.second.getPlayerCode());

		assertThat(this.game.inStatus(Status.IN_PROGRESS)).isTrue();
	}

	// LOAD-2: confirming again has no effect, and a game that no longer
	// loads keeps nothing
	@Test
	void testGivenStartedGame_whenAPlayerConfirmsAgain_thenGameLeavesNothingRegistered() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());
		this.gameLifeCycle.loadCompleteFor(this.game, this.second.getPlayerCode());

		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		assertTrue(this.gameLifeCycle.register(this.game, player -> true));
	}

	@Test
	void testGivenPlayerAlreadyReady_whenTheyConfirmAgain_thenGameKeepsLoading() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		assertThat(this.game.inStatus(Status.LOADING)).isTrue();
	}

	@Test
	void testGivenStartedGame_whenAPlayerConfirmsAgain_thenGameStartIsNotPublishedTwice() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());
		this.gameLifeCycle.loadCompleteFor(this.game, this.second.getPlayerCode());

		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		long gameStarts = this.eventMonitor.getPublishedEvents().stream() //
				.filter(event -> event.getCode() == EventCode.GAME_START) //
				.count();
		assertThat(gameStarts).isEqualTo(1);
	}

	// LOAD-4
	@Test
	void testGivenLoadingGameOfTwo_whenAPlayerIsEliminated_thenLoadingIsCancelled() {
		this.gameLifeCycle.eliminate(this.game, this.second);

		assertThat(this.codes()).containsExactly(
				EventCode.GAME_CREATED, EventCode.GAME_LOADING, EventCode.PLAYER_DIE, EventCode.GAME_CANCELLED);
	}

	// LOAD-4
	@Test
	void testGivenCancelledLoading_whenPlayersConfirm_thenGameDoesNotStart() {
		this.gameLifeCycle.eliminate(this.game, this.second);

		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());

		assertThat(this.game.inStatus(Status.IN_PROGRESS)).isFalse();
	}

	// LOAD-3
	@Test
	void testGivenLoadingGameOfThree_whenTheOnlyPlayerNotReadyIsEliminated_thenGameStarts() {
		Player third = new PlayerBuilder().build();
		Game threePlayers = this.createLoadingGame(third);
		this.gameLifeCycle.loadCompleteFor(threePlayers, this.first.getPlayerCode());
		this.gameLifeCycle.loadCompleteFor(threePlayers, this.second.getPlayerCode());

		this.gameLifeCycle.eliminate(threePlayers, third);

		assertThat(threePlayers.inStatus(Status.IN_PROGRESS)).isTrue();
	}

	// LOAD-4
	@Test
	void testGivenLoadingGameOfThree_whenAPlayerIsEliminated_thenLoadingContinues() {
		Player third = new PlayerBuilder().build();
		Game threePlayers = this.createLoadingGame(third);

		this.gameLifeCycle.eliminate(threePlayers, third);

		assertThat(threePlayers.inStatus(Status.LOADING)).isTrue();
	}

	// ABSENT-3
	@Test
	void testGivenGameInProgress_whenAPlayerIsEliminated_thenOnlyPlayerDieIsPublished() {
		this.gameLifeCycle.loadCompleteFor(this.game, this.first.getPlayerCode());
		this.gameLifeCycle.loadCompleteFor(this.game, this.second.getPlayerCode());
		int published = this.eventMonitor.getPublishedEvents().size();

		this.gameLifeCycle.eliminate(this.game, this.second);

		assertThat(this.codes().subList(published, this.codes().size())).containsExactly(EventCode.PLAYER_DIE);
	}

	@Test
	void testGivenEliminatedPlayer_whenEliminateAgain_thenNothingIsPublished() {
		this.game.eliminate(this.second);
		int published = this.eventMonitor.getPublishedEvents().size();

		this.gameLifeCycle.eliminate(this.game, this.second);

		assertThat(this.eventMonitor.getPublishedEvents()).hasSize(published);
	}

	private Game createLoadingGame(Player third) {
		Game threePlayers = new GameBuilder() //
				.withPlayers(this.first, this.second, third) //
				.withEventPublisher(this.eventMonitor) //
				.build();
		this.gameLifeCycle.register(threePlayers, player -> true);
		this.gameLifeCycle.startLoading(threePlayers);
		return threePlayers;
	}

	private java.util.List<EventCode> codes() {
		return this.eventMonitor.getPublishedEvents().stream().map(event -> event.getCode()).toList();
	}
}
