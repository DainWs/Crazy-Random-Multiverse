package com.dainws.games.crm.events;

import org.springframework.context.ApplicationEventPublisher;

import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventPublisher;

public class SpringEventPublisher implements EventPublisher {

	private ApplicationEventPublisher applicationEventPublisher;
	
	public SpringEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
		this.applicationEventPublisher = applicationEventPublisher;
	}

	@Override
	public void publish(Event event) {
		this.applicationEventPublisher.publishEvent(event);
	}
}