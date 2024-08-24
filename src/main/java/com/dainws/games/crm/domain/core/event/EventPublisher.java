package com.dainws.games.crm.domain.core.event;

public interface EventPublisher {
	static final EventPublisher NONE = (event) -> {}; 
	
	void publish(Event event);
}
