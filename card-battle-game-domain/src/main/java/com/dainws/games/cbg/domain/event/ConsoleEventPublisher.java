package com.dainws.games.cbg.domain.event;

import java.lang.System.Logger;
import java.lang.System.Logger.Level;

public class ConsoleEventPublisher implements EventPublisher {

	private Logger logger;

	public ConsoleEventPublisher() {
		this.logger = System.getLogger("Event");
	}

	@Override
	public void publish(Event event) {		
		String eventDescription = this.getFormatted(event.getCode());
		this.logger.log(Level.INFO, eventDescription);
	}

	private String getFormatted(EventCode eventCode) {
		return "Evento %s enviado".formatted(eventCode);
	}
}
