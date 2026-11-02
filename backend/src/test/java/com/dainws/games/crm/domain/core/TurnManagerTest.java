package com.dainws.games.crm.domain.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventPublisherMonitor;

class TurnManagerTest {

	private static final int PLAYERS = 2;
	private static final int FIRST_SEAT = 0;
	private static final int LAST_SEAT = PLAYERS - 1;
	private static final int STARTING_ROUND = 0;

	private EventPublisherMonitor eventMonitor;
	private Game game;
	private TurnManager turnManager;

	@BeforeEach
	void beforeEach() {
		this.eventMonitor = new EventPublisherMonitor();
		this.game = new GameBuilder() //
				.withNRandomPlayers(PLAYERS) //
				.withEventPublisher(this.eventMonitor) //
				.build();
		this.turnManager = new TurnManager();
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenNextTurn_thenRoundChangesBeforeTheTurn() {
		this.game.setTurn(new Turn(LAST_SEAT, STARTING_ROUND));

		this.turnManager.nextTurn(this.game);

		assertThat(this.eventMonitor.getPublishedEvents()) //
				.extracting(event -> event.getCode()) //
				.containsExactly(EventCode.ROUND_CHANGE, EventCode.TURN_CHANGE);
	}

	@Test
	void testGivenTurnThatDoesNotWrap_whenNextTurn_thenOnlyTheTurnChanges() {
		this.game.setTurn(new Turn(FIRST_SEAT, STARTING_ROUND));

		this.turnManager.nextTurn(this.game);

		assertThat(this.eventMonitor.getPublishedEvents()) //
				.extracting(event -> event.getCode()) //
				.containsExactly(EventCode.TURN_CHANGE);
	}
}
