package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

class GameEventControllerTest {

	private static final int SEQUENCE = 7;
	private static final int PLAYERS = 3;

	RecordingCommunicationClient communicationClient;
	GameEventController controller;

	@BeforeEach
	void beforeEach() {
		this.communicationClient = new RecordingCommunicationClient();
		this.controller = new GameEventController(this.communicationClient);
	}

	@Test
	void testGivenPlayerReceivesCard_whenHandleEvent_thenEveryPlayerGetsTheEvent() {
		Event event = this.createReceiveCardEvent();

		this.controller.handleEvent(event);

		assertThat(this.communicationClient.getSentEvents()).hasSize(PLAYERS);
	}

	@Test
	void testGivenPlayerReceivesCard_whenHandleEvent_thenEveryPlayerGetsTheSequence() {
		Event event = this.createReceiveCardEvent();

		this.controller.handleEvent(event);

		List<SentEvent> sentEvents = this.communicationClient.getSentEvents();
		assertThat(sentEvents) //
				.extracting(sentEvent -> sentEvent.event().getSequence()) //
				.containsOnly(SEQUENCE);
	}

	private Event createReceiveCardEvent() {
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Player target = game.getPlayers().get(0);
		EventDetails details = new EventDetails(game);
		details.setTargetPlayer(target);
		Event event = new Event(EventCode.PLAYER_RECEIVE_CARD, details);
		event.setSequence(SEQUENCE);
		return event;
	}
}
