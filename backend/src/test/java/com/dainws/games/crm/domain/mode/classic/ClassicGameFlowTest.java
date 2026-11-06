package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameTurnSetter;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.domain.core.player.Player;

class ClassicGameFlowTest {

	private static final int FIRST_SEAT = 0;
	private static final int LAST_SEAT = 2;
	private static final int FIRST_ROUND = 1;
	private static final Coordinate FIRST_COORDINATE = new Coordinate(0, 0);

	private Player first;
	private Player second;
	private Player third;
	private List<Integer> dealtRounds;
	private EventPublisherMonitor eventMonitor;
	private Game game;
	private ClassicGameFlow gameFlow;

	@BeforeEach
	void beforeEach() {
		this.first = new PlayerBuilder().withCode("first").build();
		this.second = new PlayerBuilder().withCode("second").build();
		this.third = new PlayerBuilder().withCode("third").build();
		this.dealtRounds = new ArrayList<>();
		this.eventMonitor = new EventPublisherMonitor();

		Dealer dealer = new Dealer(null);
		dealer.setDealStrategyFactory(round -> {
			this.dealtRounds.add(round);
			return deck -> List.of(CardBuilder.buildEquipment());
		});

		this.game = new GameBuilder() //
				.withPlayers(this.first, this.second, this.third) //
				.withDealer(dealer) //
				.withEventPublisher(this.eventMonitor) //
				.build();
		this.eventMonitor.setGame(this.game);
		this.gameFlow = new ClassicGameFlow();
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenRoundIsAnnouncedThenCardsAreDealtThenTurnIsAnnounced() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.publishedCodes()).containsExactly( //
				EventCode.ROUND_CHANGE, //
				EventCode.PLAYER_RECEIVE_CARD, EventCode.PLAYER_RECEIVE_CARD, EventCode.PLAYER_RECEIVE_CARD, //
				EventCode.TURN_CHANGE);
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenCardsAreDealtSeatBySeat() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.receivers()).containsExactly(this.first, this.second, this.third);
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenTheRoundIsTheFirstOne() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.game.getRoundNumber()).isEqualTo(FIRST_ROUND);
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenCardsOfTheFirstRoundAreDealt() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.dealtRounds).containsOnly(FIRST_ROUND);
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenTheFirstSeatHasTheTurn() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.game.getPlayerWithTurn()).isEqualTo(this.first);
	}

	@Test
	void testGivenCreatedGame_whenStartGame_thenEveryPlayerHoldsTheirCards() {
		this.gameFlow.onStartGame(this.game);

		assertThat(this.game.getPlayers()).allSatisfy(player -> assertThat(player.getHand().getCards()).hasSize(1));
	}

	@Test
	void testGivenTurnInTheMiddleOfARound_whenNextTurn_thenOnlyTheTurnIsAnnounced() {
		GameTurnSetter.setTurn(this.game, new Turn(FIRST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(this.publishedCodes()).containsExactly(EventCode.TURN_CHANGE);
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenNextTurn_thenNewRoundDealsBeforeTheTurnIsAnnounced() {
		GameTurnSetter.setTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(this.publishedCodes()).containsExactly( //
				EventCode.ROUND_CHANGE, //
				EventCode.PLAYER_RECEIVE_CARD, EventCode.PLAYER_RECEIVE_CARD, EventCode.PLAYER_RECEIVE_CARD, //
				EventCode.TURN_CHANGE);
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenNextTurn_thenTheNextRoundIsDealt() {
		GameTurnSetter.setTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(this.dealtRounds).containsOnly(FIRST_ROUND + 1);
	}

	@Test
	void testGivenEliminatedStartingPlayer_whenNextTurnFromTheLastSeat_thenOnlyLivingPlayersAreDealt() {
		this.first.die();
		GameTurnSetter.setTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(this.receivers()).containsExactly(this.second, this.third);
	}

	@Test
	void testGivenEliminatedStartingPlayer_whenNextTurnFromTheLastSeat_thenTheTurnGoesToTheNextLivingPlayer() {
		this.first.die();
		GameTurnSetter.setTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(this.game.getPlayerWithTurn()).isEqualTo(this.second);
	}

	@Test
	void testGivenTurnOfTheLastSeat_whenNextTurn_thenThePlayerWithTurnOnlyChangesWithTheTurnChange() {
		PlayerWithTurnRecorder recorder = new PlayerWithTurnRecorder(this.game);
		this.eventMonitor.setWrapper(recorder);
		GameTurnSetter.setTurn(this.game, new Turn(LAST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(recorder.getPlayersWithTurn()).containsExactly( //
				this.third, this.third, this.third, this.third, this.first);
	}

	@Test
	void testGivenCombatantOfTheNextPlayerWithoutAttacks_whenNextTurn_thenItCanAttackWhenTheTurnIsAnnounced() {
		Warrior attacker = new CardBuilder().buildFullValidWarrior();
		this.game.getPlayerZone(this.second).putCombatant(FIRST_COORDINATE, attacker);
		new CardBuilder().buildFullValidWarrior().receiveDamageFrom(attacker);
		AttackAvailabilityRecorder recorder = new AttackAvailabilityRecorder(attacker);
		this.eventMonitor.setWrapper(recorder);
		GameTurnSetter.setTurn(this.game, new Turn(FIRST_SEAT, FIRST_ROUND));

		this.gameFlow.onNextTurn(this.game);

		assertThat(recorder.getCanAttackAtTurnChange()).isTrue();
	}

	private List<EventCode> publishedCodes() {
		return this.eventMonitor.getPublishedEvents().stream().map(Event::getCode).toList();
	}

	private List<Player> receivers() {
		return this.eventMonitor.getPublishedEvents().stream() //
				.filter(event -> event.getCode() == EventCode.PLAYER_RECEIVE_CARD) //
				.map(event -> event.getDetails().getTargetPlayer()) //
				.toList();
	}
}
