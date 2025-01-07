package com.dainws.games.crm.tools.domain.core.event;

import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;

public interface EventMonitor {
	boolean wasEventPublished(EventCode code);
	
	boolean wasEventNotPublished(EventCode code);
	
	boolean nonePublishedEventMatch(Predicate<Event> predicate);
	
	boolean anyPublishedEventMatch(Predicate<Event> predicate);
	
	boolean allPublishedEventMatch(Predicate<Event> predicate);
	
	List<Event> getPublishedEvents();
	
	int countPublishedEvents();
}
