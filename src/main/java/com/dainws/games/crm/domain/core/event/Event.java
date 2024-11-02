package com.dainws.games.crm.domain.core.event;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;

public class Event {
	private EventCode code;
	private EventDetails details;

	public Event(EventCode code, Game game) {
		this.code = code;
		this.details = new EventDetails(game);
	}

	public Event(EventCode code, EventDetails details) {
		this.code = code;
		this.details = details;
	}

	public EventCode getCode() {
		return this.code;
	}
	
	public GameCode getGameCode() {
		return this.details.getGameCode();
	}

	public EventDetails getDetails() {
		return details;
	}
}
