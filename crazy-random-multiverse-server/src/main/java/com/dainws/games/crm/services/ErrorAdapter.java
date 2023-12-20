package com.dainws.games.crm.services;

import java.util.List;

import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.communication.GameChannel;
import com.dainws.games.cbg.domain.communication.Destination;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.PlayerCode;

public class ErrorAdapter {
	private GameChannel gameChannel;

	public ErrorAdapter(GameChannel gameChannel) {
		this.gameChannel = gameChannel;
	}

	public void sendErrorToPlayers(List<Player> players, Error error) {
		for (Player player : players) {
			this.sendErrorToPlayer(player, error);
		}
	}
	
	public void sendErrorToPlayer(Player player, Error error) {
		this.gameChannel.send(Destination.of(player), error);
	}
	
	public void sendErrorToPlayer(PlayerCode playerCode, Error error) {
		this.gameChannel.send(Destination.from(playerCode.getCode()), error);
	}
}
