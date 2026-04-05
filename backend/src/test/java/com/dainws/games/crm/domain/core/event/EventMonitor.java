package com.dainws.games.crm.domain.core.event;

import java.util.List;
import java.util.function.Predicate;

public interface EventMonitor {
	boolean wasEventPublished(EventCode code);
	
	boolean wasEventNotPublished(EventCode code);
	
	boolean nonePublishedEventMatch(Predicate<Event> predicate);
	
	boolean anyPublishedEventMatch(Predicate<Event> predicate);
	
	boolean allPublishedEventMatch(Predicate<Event> predicate);
	
	List<Event> getPublishedEvents();
	
	int countPublishedEvents();
}
