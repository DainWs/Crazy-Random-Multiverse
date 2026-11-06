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
	private static final int FIRST_ROUND = 1;

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
	void testGivenTurnOfTheLastSeat_whenGetNextTurn_thenTheTurnWrapsToTheNextRound() {
		this.game.setTurn(new Turn(LAST_SEAT, FIRST_ROUND));

		Turn nextTurn = this.turnManager.getNextTurn(this.game);

		assertThat(nextTurn).isEqualTo(new Turn(FIRST_SEAT, FIRST_ROUND + 1));
	}

	@Test
	void testGivenTurnThatDoesNotWrap_whenGetNextTurn_thenOnlyTheSeatChanges() {
		this.game.setTurn(new Turn(FIRST_SEAT, FIRST_ROUND));

		Turn nextTurn = this.turnManager.getNextTurn(this.game);

		assertThat(nextTurn).isEqualTo(new Turn(LAST_SEAT, FIRST_ROUND));
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenGetNextTurn_thenNothingChangesInTheGame() {
		this.game.setTurn(new Turn(LAST_SEAT, FIRST_ROUND));

		this.turnManager.getNextTurn(this.game);

		assertThat(this.game.getTurn()).isEqualTo(new Turn(LAST_SEAT, FIRST_ROUND));
	}

	@Test
	void testGivenNotStartedGame_whenStartRound_thenTheRoundChanges() {
		this.turnManager.startRound(this.game, FIRST_ROUND);

		assertThat(this.game.getRoundNumber()).isEqualTo(FIRST_ROUND);
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenStartRound_thenThePlayerWithTurnIsStillThePreviousOne() {
		this.game.setTurn(new Turn(LAST_SEAT, FIRST_ROUND));

		this.turnManager.startRound(this.game, FIRST_ROUND + 1);

		assertThat(this.game.getTurnNumber()).isEqualTo(LAST_SEAT);
	}

	@Test
	void testGivenAGame_whenStartRound_thenRoundChangeIsPublished() {
		this.turnManager.startRound(this.game, FIRST_ROUND);

		assertThat(this.eventMonitor.getPublishedEvents()) //
				.extracting(event -> event.getCode()) //
				.containsExactly(EventCode.ROUND_CHANGE);
	}

	@Test
	void testGivenAGame_whenBeginTurn_thenTheTurnChanges() {
		Turn turn = new Turn(LAST_SEAT, FIRST_ROUND);

		this.turnManager.beginTurn(this.game, turn);

		assertThat(this.game.getTurn()).isEqualTo(turn);
	}

	@Test
	void testGivenAGame_whenBeginTurn_thenNoEventIsPublished() {
		this.turnManager.beginTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		assertThat(this.eventMonitor.getPublishedEvents()).isEmpty();
	}

	@Test
	void testGivenTurnNotBegun_whenBeginTurn_thenTheTurnIsStarted() {
		this.turnManager.beginTurn(this.game, new Turn(FIRST_SEAT, FIRST_ROUND));

		assertThat(this.game.isTurnStarted()).isTrue();
	}

	@Test
	void testGivenAGame_whenAnnounceTurn_thenTurnChangeIsPublished() {
		this.turnManager.announceTurn(this.game);

		assertThat(this.eventMonitor.getPublishedEvents()) //
				.extracting(event -> event.getCode()) //
				.containsExactly(EventCode.TURN_CHANGE);
	}
}
