package com.dainws.games.cbg.domain.event;

import java.util.List;

import com.dainws.games.cbg.domain.player.Player;

public class EventHandler {
	private EventChannel eventChannel;

	public EventHandler() {
		this.eventChannel = new ConsoleEventChannel();
	}
	
	public EventHandler(EventChannel eventChannel) {
		this.eventChannel = eventChannel;
	}
	
	public final void notifyEventToPlayers(List<Player> players, Event event) {
		for (Player player : players) {
			this.notifyEventToPlayer(player, event);
		}
	}

	public final void notifyEventToPlayer(Player player, Event event) {
		this.eventChannel.send(player, event);
	}

	public void setEventChannel(EventChannel eventChannel) {
		this.eventChannel = eventChannel;
	}
}
