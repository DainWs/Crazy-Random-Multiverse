package com.dainws.games.crm.domain.core.event;

class NoneEventPublisher implements EventPublisher {
	
	NoneEventPublisher() {}
	
	@Override
	public void publish(EventCode code) {
		this.publish(code, new EventDetails(null));
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.publish(new Event(code, details));
	}

	@Override
	public void publish(Event event) {};
}
