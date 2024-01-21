package com.dainws.games.cbg.domain.event;

public class Event {

	private EventCode code;
	private EventDetails details;

	public Event(EventCode code) {
		this.code = code;
	}

	public Event(EventCode code, EventDetails details) {
		this.code = code;
		this.details = details;
	}

	public EventCode getCode() {
		return this.code;
	}

	public EventDetails getDetails() {
		return details;
	}
	
	protected void setDetails(EventDetails details) {
		this.details = details;
	}
}
