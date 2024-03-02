package com.dainws.games.crm.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Configuration;

import com.dainws.games.cbg.domain.event.EventTrigger;
import com.dainws.games.crm.events.SpringEventPublisher;

@Configuration
public class EventConfiguration {
	
	@Autowired
	public void setEventPublisher(List<EventTrigger> eventTriggers, ApplicationEventPublisher eventPublisher) {
		SpringEventPublisher springEventPublisher = new SpringEventPublisher(eventPublisher);
		
		for (EventTrigger eventTrigger : eventTriggers) {
			eventTrigger.setEventPublisher(springEventPublisher);
		}
	}
	
}
