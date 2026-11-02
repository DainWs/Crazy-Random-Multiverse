package com.dainws.games.crm.controller.events;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;

import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.mode.GameModeEventDispatcher;

public class ReactingModeEventDispatcher implements GameModeEventDispatcher {

	private final GameMode gameMode;
	private final ApplicationEventPublisher publisher;
	private final List<Integer> sentEventsWhenReacting;

	private RecordingCommunicationClient communicationClient;
	private EventCode cause;
	private EventCode effect;

	public ReactingModeEventDispatcher(GameMode gameMode, ApplicationEventPublisher publisher) {
		this.gameMode = gameMode;
		this.publisher = publisher;
		this.sentEventsWhenReacting = new ArrayList<>();
	}

	@Override
	public GameMode getGameMode() {
		return this.gameMode;
	}

	@Override
	public void dispatch(Event event) {
		this.sentEventsWhenReacting.add(this.communicationClient.getSentEvents().size());

		if (event.getCode() == this.cause) {
			this.publisher.publishEvent(new Event(this.effect, event.getDetails()));
		}
	}

	public void reactTo(EventCode cause, EventCode effect) {
		this.cause = cause;
		this.effect = effect;
	}

	public List<Integer> getSentEventsWhenReacting() {
		return List.copyOf(this.sentEventsWhenReacting);
	}

	public void setCommunicationClient(RecordingCommunicationClient communicationClient) {
		this.communicationClient = communicationClient;
	}
}
