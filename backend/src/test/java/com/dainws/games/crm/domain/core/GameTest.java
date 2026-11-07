package com.dainws.games.crm.domain.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.builder.PlayerBuilder;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.domain.core.player.Player;

class GameTest {

	private static final Coordinate FIRST_COORDINATE = new Coordinate(0, 0);

	private Player first;
	private Player second;
	private EventPublisherMonitor eventMonitor;
	private Game game;

	@BeforeEach
	void beforeEach() {
		this.first = new PlayerBuilder().withCode("first").build();
		this.second = new PlayerBuilder().withCode("second").build();
		this.eventMonitor = new EventPublisherMonitor();
		this.game = new GameBuilder() //
				.withPlayers(this.first, this.second) //
				.withEventPublisher(this.eventMonitor) //
				.build();
		this.eventMonitor.setGame(this.game);
	}

	// CON-22
	@Test
	void testGivenPlayer_whenEliminate_thenPlayerDieIsPublishedForThatPlayer() {
		this.game.eliminate(this.second);

		assertThat(this.eventMonitor.getPublishedEvents()).hasSize(1);
		assertThat(this.eventMonitor.getPublishedEvents().get(0).getCode()).isEqualTo(EventCode.PLAYER_DIE);
		assertThat(this.eventMonitor.getPublishedEvents().get(0).getDetails().getTargetPlayer()).isEqualTo(this.second);
	}

	// ELIM-1
	@Test
	void testGivenPlayer_whenEliminate_thenPlayerIsDead() {
		this.game.eliminate(this.second);

		assertThat(this.second.isAlive()).isFalse();
	}

	// SPEC-1
	@Test
	void testGivenPlayer_whenEliminate_thenPlayerIsSpectator() {
		this.game.eliminate(this.second);

		assertThat(this.second.isSpectator()).isTrue();
	}

	// ELIM-3
	@Test
	void testGivenPlayerWithCards_whenEliminate_thenTheirZoneIsEmpty() {
		this.game.getPlayerZone(this.second).putCombatant(FIRST_COORDINATE, new CardBuilder().buildFullValidWarrior());

		this.game.eliminate(this.second);

		assertThat(this.game.getPlayerZone(this.second).hasCombatants()).isFalse();
	}

	// ELIM-3
	@Test
	void testGivenPlayerWithCardsInHand_whenEliminate_thenTheirHandIsEmpty() {
		this.second.getHand().addCard(CardBuilder.buildEquipment());

		this.game.eliminate(this.second);

		assertThat(this.second.getHand().isEmpty()).isTrue();
	}
}
