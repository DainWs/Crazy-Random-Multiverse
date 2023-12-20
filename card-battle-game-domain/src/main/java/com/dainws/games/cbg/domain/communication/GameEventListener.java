package com.dainws.games.cbg.domain.communication;

import java.util.List;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.player.Player;

public class GameEventListener {
	private GameChannel gameChannel;

	public GameEventListener() {
		this.gameChannel = new ConsoleChannel();
	}
	
	public GameEventListener(GameChannel gameChannel) {
		this.gameChannel = gameChannel;
	}

	public void onGameIsCreated(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		Event event = new Event(EventCode.GAME_CREATED, details);
		this.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void onGameIsStarted(Game game) {
		Event event = new Event(EventCode.GAME_START);
		this.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void onGameEnd(Game game) {
		Event event = new Event(EventCode.GAME_END);
		this.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void onPlayerWinGame(Game game, Player player) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);
		
		Event event = new Event(EventCode.PLAYER_WIN, details);
		this.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void onPlayerLoseGame(Game game, Player player) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);
		
		Event event = new Event(EventCode.PLAYER_LOSE, details);
		this.notifyEventToPlayers(game.getPlayers(), event);
		
		 // TODO do here if a winner exists
	}
	
	private void notifyEventToPlayers(List<Player> players, Event event) {
		for (Player player : players) {
			this.notifyEventToPlayer(player, event);
		}
	}

	private void notifyEventToPlayer(Player player, Event event) {
		this.gameChannel.send(Destination.of(player), event);
	}

	public void setCommunicationChannel(GameChannel gameChannel) {
		this.gameChannel = gameChannel;
	}
}
