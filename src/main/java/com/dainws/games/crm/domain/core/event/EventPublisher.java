package com.dainws.games.crm.domain.core.event;

public interface EventPublisher {
	static final EventPublisher NONE = new NoneEventPublisher(); 
	
	void publish(EventCode code);
	
	void publish(EventCode code, EventDetails details);
	
	void publish(Event event);
}
