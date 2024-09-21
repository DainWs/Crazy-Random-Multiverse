package com.dainws.games.crm.tools.domain.core.event;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventPublisher;

public class EventPublisherMonitor implements EventPublisher {

	private List<Event> publishedEvents;

	public EventPublisherMonitor() {
		this.publishedEvents = new ArrayList<>();
	}
	
	@Override
	public void publish(Event event) {
		this.publishedEvents.add(event);
	}
	
	public boolean wasEventPublished(EventCode code) {
		Objects.requireNonNull(code);
		return this.anyPublishedEventMatch(event -> code.equals(event.getCode()));
	}
	
	public boolean wasEventNotPublished(EventCode code) {
		Objects.requireNonNull(code);
		return this.nonePublishedEventMatch(event -> code.equals(event.getCode()));
	}
	
	public boolean nonePublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.noneMatch(predicate);
	}
	
	public boolean anyPublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.anyMatch(predicate);
	}
	
	public boolean allPublishedEventMatch(Predicate<Event> predicate) {
		Objects.requireNonNull(predicate);
		return this.publishedEvents.stream()
				.allMatch(predicate);
	}
	
	public List<Event> getPublishedEvents() {
		return publishedEvents;
	}
	
	public int countPublishedEvents() {
		return this.publishedEvents.size();
	}
}
