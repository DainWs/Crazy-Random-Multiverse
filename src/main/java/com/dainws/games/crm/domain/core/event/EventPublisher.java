package com.dainws.games.crm.domain.core.event;

public interface EventPublisher {
	static final EventPublisher NONE = new EventPublisher() {}; 
	
	default void publish(EventCode code) {
		this.publish(code, new EventDetails(null));
	}
	
	default void publish(EventCode code, EventDetails details) {
		this.publish(new Event(code, details));
	}
	
	default void publish(Event event) {};
}
