package com.dainws.games.crm.domain.event;

public interface EventPublisher {
	void publish(Event event);
}
