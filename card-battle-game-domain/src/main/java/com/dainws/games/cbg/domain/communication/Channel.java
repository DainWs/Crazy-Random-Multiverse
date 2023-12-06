package com.dainws.games.cbg.domain.communication;

public interface Channel {	
	void send(Destination destination, Error error);

	void send(Destination destination, Event event);
}
