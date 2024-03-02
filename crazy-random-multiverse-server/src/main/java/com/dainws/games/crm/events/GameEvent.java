package com.dainws.games.crm.events;

import java.util.Objects;

import org.springframework.context.ApplicationEvent;

import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;

public class GameEvent extends ApplicationEvent {

	private static final long serialVersionUID = -4369876197818391866L;
	
	public GameEvent(Event event) {
		super(event);
	}
	
	@Override
	public Event getSource() {
		return (Event) super.getSource();
	}
	
	public boolean hasCode(EventCode eventCode) {
		return Objects.equals(this.getSourceCode(), eventCode);
	}
	
	private EventCode getSourceCode() {
		return this.getSource().getCode();
	}
}
