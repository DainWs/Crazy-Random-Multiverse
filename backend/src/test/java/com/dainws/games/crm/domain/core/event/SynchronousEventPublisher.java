package com.dainws.games.crm.domain.core.event;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

/** Hands each event to its listeners in order, on the publishing thread, like the listeners of Spring. */
public class SynchronousEventPublisher implements EventPublisher {
	private final List<Consumer<Event>> listeners;

	public SynchronousEventPublisher() {
		this.listeners = new ArrayList<>();
	}

	public void subscribe(Consumer<Event> listener) {
		this.listeners.add(listener);
	}

	@Override
	public void publish(EventCode code) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.publish(new Event(code, details));
	}

	@Override
	public void publish(Event event) {
		for (Consumer<Event> listener : this.listeners) {
			listener.accept(event);
		}
	}
}
