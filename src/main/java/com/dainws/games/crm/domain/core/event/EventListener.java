package com.dainws.games.crm.domain.core.event;

public interface EventListener extends java.util.EventListener {

	void handle(Event event);

}
