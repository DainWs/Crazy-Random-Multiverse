package com.dainws.games.crm.tools.domain.core.event;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;

public class EventPublisherMonitor implements EventPublisher, EventMonitor {

	private Game game;
	private EventPublisher wrapper;
	private List<Event> publishedEvents;

	public EventPublisherMonitor() {
		this.wrapper = EventPublisher.NONE;
		this.publishedEvents = new ArrayList<>();
	}
	
	public EventPublisherMonitor(Game game, EventPublisher wrapper) {
		this.game = game;
		this.wrapper = wrapper;
		this.publishedEvents = new ArrayList<>();
	}
	
	@Override
	public void publish(EventCode code) {
		this.publishedEvents.add(new Event(code, this.game));
		this.wrapper.publish(code);
	}
	
	@Override
	public void publish(EventCode code, EventDetails details) {
		this.publishedEvents.add(new Event(code, details));
		this.wrapper.publish(code, details);
	}
	
	@Override
	public void publish(Event event) {
		this.publishedEvents.add(event);
		this.wrapper.publish(event);
	}

	@Override
	public boolean wasEventPublished(EventCode code) {
		Objects.requireNonNull(code);
		return this.anyPublishedEventMatch(event -> code.equals(event.getCode()));
	}

	@Override
	public boolean wasEventNotPublished(EventCode code) {
		Objects.requireNonNull(code);
		return this.nonePublishedEventMatch(event -> code.equals(event.getCode()));
	}

	@Override
	public boolean nonePublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.noneMatch(predicate);
	}

	@Override
	public boolean anyPublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.anyMatch(predicate);
	}

	@Override
	public boolean allPublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.allMatch(predicate);
	}

	@Override
	public List<Event> getPublishedEvents() {
		return publishedEvents;
	}

	@Override
	public int countPublishedEvents() {
		return this.publishedEvents.size();
	}
	
	public void setGame(Game game) {
		this.game = game;
	}
	
	public void setWrapper(EventPublisher wrapper) {
		this.wrapper = wrapper;
	}
}
