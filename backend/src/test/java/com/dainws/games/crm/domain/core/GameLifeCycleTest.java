package com.dainws.games.crm.domain.core;

import static org.assertj.core.api.Assertions.assertThat;

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
}
