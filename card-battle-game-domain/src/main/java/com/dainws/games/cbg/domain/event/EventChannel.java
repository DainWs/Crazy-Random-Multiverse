package com.dainws.games.cbg.domain.event;

import java.util.List;

import com.dainws.games.cbg.domain.player.Player;

public interface EventChannel {
	void send(List<Player> to, Event event);
	
	void send(Player to, Event event);
}
