package com.dainws.games.crm.controller.events;

import org.springframework.context.ApplicationEventPublisher;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;

public class SpringEventPublisher implements EventPublisher {

	private ApplicationEventPublisher applicationEventPublisher;

	public SpringEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
		this.applicationEventPublisher = applicationEventPublisher;
	}

	@Override
	public void publish(EventCode code) {
		this.publish(code, new EventDetails(null));
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.publish(new Event(code, details));
	}

	@Override
	public void publish(Event event) {
		this.applicationEventPublisher.publishEvent(event);
	}
}
