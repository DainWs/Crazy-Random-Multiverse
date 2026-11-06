package com.dainws.games.crm.controller.events;

import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Controller;

@Controller
public class GameEventController {

	private CommunicationClient communicationClient;

	public GameEventController(CommunicationClient communicationClient) {
		this.communicationClient = communicationClient;
	}

	@Order(EventListenerOrder.SEND)
	@EventListener
	public void handleEvent(MappedEvent mappedEvent) {
		mappedEvent.eventsByPlayer().forEach(this.communicationClient::sendEvent);
	}
}
