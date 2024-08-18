package com.dainws.games.crm.domain.builder;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;

public class GameBuilder {
	private List<Player> players;
	private Player playerTurn;
	private int currentTurn;
	private int currentRound;
	
	public GameBuilder() {
		this.players = new ArrayList<>();
		this.playerTurn = null;
		this.currentTurn = 0;
		this.currentRound = 0;
	}
	
	public GameBuilder withPlayers(Player ...players) {
		return this.withPlayers(List.of(players));
	}
	
	public GameBuilder addPlayers(Player ...players) {
		return this.addPlayers(List.of(players));
	}
	
	public GameBuilder withPlayers(List<Player> players) {
		this.players.clear();
		return this.addPlayers(players);
	}
	
	public GameBuilder addPlayers(List<Player> players) {
		this.players.addAll(players);
		return this;
	}

	public GameBuilder withNRandomPlayers(int numberOfPlayers) {
		this.players.clear();
		for (int i = 0; i < numberOfPlayers; i++) {
			int numberOfCards = (int) (Math.random() * 10) + 1;
			Player randomPlayer = new PlayerBuilder()
					.withNRandomCardsInHand(numberOfCards)
					.build();
			this.players.add(randomPlayer);
		}
		return this;
	}
	
	public GameBuilder addNRandomPlayers(int numberOfPlayers) {
		for (int i = 0; i < numberOfPlayers; i++) {
			int numberOfCards = (int) (Math.random() * 10) + 1;
			Player randomPlayer = new PlayerBuilder()
					.withNRandomCardsInHand(numberOfCards)
					.build();
			this.players.add(randomPlayer);
		}
		return this;
	}
	
	public GameBuilder removeAllPlayers() {
		this.players.clear();
		return this;
	}
	
	public GameBuilder withRound(int round) {
		this.currentRound = round;
		return this;
	}
	
	public GameBuilder withTurn(int turn) {
		this.currentTurn = turn;
		return this;
	}
	
	public GameBuilder withTurn(Player playerTurn) {
		this.playerTurn = playerTurn;
		return this;
	}
	
	public Game build() {
		Game game = new Game(this.players);
		game.setRound(this.currentRound);
		game.setTurn(this.currentTurn);
		if (this.playerTurn != null) {
			game.setTurn(this.getPlayerTurnIndex());
		}

		return game;
	}
	
	private int getPlayerTurnIndex() {
		int playerTurnIndex = this.players.indexOf(this.playerTurn);
		
		if (playerTurnIndex == -1) {
			throw new IllegalArgumentException("Player with turn does not exist among the players");
		}
		
		return playerTurnIndex;
	}
}
