package com.dainws.games.crm.domain.core.event;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;

public class Event {
	public static final int NO_SEQUENCE = 0;

	private EventCode code;
	private EventDetails details;
	private int sequence;

	public Event(EventCode code, Game game) {
		this.code = code;
		this.details = new EventDetails(game);
		this.sequence = NO_SEQUENCE;
	}

	public Event(EventCode code, EventDetails details) {
		this.code = code;
		this.details = details;
		this.sequence = NO_SEQUENCE;
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

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
}
