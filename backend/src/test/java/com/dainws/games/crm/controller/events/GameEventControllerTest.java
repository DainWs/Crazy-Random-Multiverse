package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;

class GameEventControllerTest {

	private static final int PLAYERS = 3;

	RecordingCommunicationClient communicationClient;
	GameEventController controller;

	@BeforeEach
	void beforeEach() {
		this.communicationClient = new RecordingCommunicationClient();
		this.controller = new GameEventController(this.communicationClient);
	}

	@Test
	void testGivenEventMappedForEveryPlayer_whenHandleEvent_thenEveryPlayerGetsTheEvent() {
		MappedEvent mappedEvent = this.createMappedEvent();

		this.controller.handleEvent(mappedEvent);

		assertThat(this.communicationClient.getSentEvents()) //
				.extracting(SentEvent::player) //
				.containsExactlyElementsOf(mappedEvent.eventsByPlayer().keySet());
	}

	@Test
	void testGivenEventMappedForEveryPlayer_whenHandleEvent_thenEachPlayerGetsTheirOwnMapping() {
		MappedEvent mappedEvent = this.createMappedEvent();

		this.controller.handleEvent(mappedEvent);

		assertThat(this.communicationClient.getSentEvents()) //
				.extracting(SentEvent::eventDto) //
				.containsExactlyElementsOf(mappedEvent.eventsByPlayer().values());
	}

	private MappedEvent createMappedEvent() {
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Map<Player, EventDto> eventsByPlayer = new LinkedHashMap<>();
		for (Player player : game.getPlayers()) {
			eventsByPlayer.put(player, new EventDto());
		}
		return new MappedEvent(new Event(EventCode.TURN_CHANGE, game), eventsByPlayer);
	}
}
