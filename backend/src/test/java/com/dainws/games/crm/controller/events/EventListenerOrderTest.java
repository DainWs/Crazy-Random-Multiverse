package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.DummyGameStrategy;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;

class EventListenerOrderTest {

	private static final int ONE_EVENT_SENT = 1;
	private static final int TWO_EVENTS_SENT = 2;

	private AnnotationConfigApplicationContext context;
	private RecordingCommunicationClient communicationClient;
	private ReactingModeEventDispatcher modeDispatcher;
	private Game game;

	@BeforeEach
	void beforeEach() {
		this.game = new GameBuilder().withNRandomPlayers(1).build();
		this.communicationClient = new RecordingCommunicationClient();
		this.context = new AnnotationConfigApplicationContext();
		this.modeDispatcher = new ReactingModeEventDispatcher(DummyGameStrategy.DUMMY_MODE, this.context);
		this.modeDispatcher.setCommunicationClient(this.communicationClient);
		this.modeDispatcher.reactTo(EventCode.PLAYER_PASS_TURN, EventCode.TURN_CHANGE);
		this.context.registerBean(RecordingCommunicationClient.class, () -> this.communicationClient);
		this.context.registerBean(ReactingModeEventDispatcher.class, () -> this.modeDispatcher);
		this.context.registerBean(SpringGameEventDispatcher.class);
		this.context.registerBean(GameEventController.class);
		this.context.refresh();
	}

	@AfterEach
	void afterEach() {
		this.context.close();
	}

	@Test
	void testGivenEventThatTriggersAnother_whenPublish_thenTheCauseIsSentBeforeTheEffect() {
		this.context.publishEvent(new Event(EventCode.PLAYER_PASS_TURN, this.game));

		assertThat(this.communicationClient.getSentEvents()) //
				.extracting(sentEvent -> sentEvent.event().getCode()) //
				.containsExactly(EventCode.PLAYER_PASS_TURN, EventCode.TURN_CHANGE);
	}

	@Test
	void testGivenEvent_whenPublish_thenItIsSentBeforeTheGameReactsToIt() {
		this.context.publishEvent(new Event(EventCode.PLAYER_PASS_TURN, this.game));

		assertThat(this.modeDispatcher.getSentEventsWhenReacting()) //
				.containsExactly(ONE_EVENT_SENT, TWO_EVENTS_SENT);
	}
}
