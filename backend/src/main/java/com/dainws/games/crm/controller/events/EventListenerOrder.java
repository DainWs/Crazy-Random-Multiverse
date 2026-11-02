package com.dainws.games.crm.controller.events;

import org.springframework.core.Ordered;

/**
 * An event is sent to the clients before the game reacts to it, so the events the game publishes in response reach
 * them after their cause (CON-22).
 */
public final class EventListenerOrder {

	public static final int SEND = Ordered.HIGHEST_PRECEDENCE;
	public static final int REACT = SEND + 1;

	private EventListenerOrder() {
	}
}
