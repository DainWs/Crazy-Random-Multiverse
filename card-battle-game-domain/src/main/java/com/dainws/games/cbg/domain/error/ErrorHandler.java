package com.dainws.games.cbg.domain.error;

import java.util.List;

import com.dainws.games.cbg.domain.player.Player;


// TODO problably, Observer singleton?
public class ErrorHandler {
	private ErrorChannel errorChannel;

	public ErrorHandler() {
		this.errorChannel = new ConsoleErrorChannel();
	}
	
	public ErrorHandler(ErrorChannel errorChannel) {
		this.errorChannel = errorChannel;
	}

	public void notifyErrorToPlayers(List<Player> players, Error error) {
		for (Player player : players) {
			this.notifyErrorToPlayer(player, error);
		}
	}
	
	public void notifyErrorToPlayer(Player player, Error error) {
		this.errorChannel.send(player, error);
	}
}
