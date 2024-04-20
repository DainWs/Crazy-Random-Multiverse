package com.dainws.games.cbg.domain;

import java.util.List;

import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.exception.PlayerNotFoundException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.PlayerCode;

public class Game {
	private static final int ROUND_BEFORE_START = -1;

	private GameCode code;
	private int playerIndexWithTurn;
	private int round;

	private Board board;
	private List<Player> players;

	public Game(List<Player> players) {
		this.code = new GameCode();
		this.round = 0;
		this.playerIndexWithTurn = 0;
		this.players = players;
		this.board = new Board(players);
	}

	public GameCode getCode() {
		return code;
	}

	public int getRound() {
		return round;
	}

	public void setRound(int round) {
		this.round = round;
	}

	public int getTurn() {
		return playerIndexWithTurn;
	}

	public void setTurn(int turn) {
		this.playerIndexWithTurn = turn;
	}

	public List<Player> getPlayers() {
		return List.copyOf(this.players);
	}

	public Player getPlayerWithTurn() {
		return this.players.get(this.playerIndexWithTurn);
	}

	public Player getPlayer(PlayerCode playerCode) throws PlayerNotFoundException {
		return this.players.stream()
			.filter(player -> player.getPlayerCode().equals(playerCode))
			.findFirst()
			.orElseThrow(PlayerNotFoundException::new);
	}

	public boolean hasPlayer(PlayerCode playerCode) {
		return this.players.stream()
			.anyMatch(player -> player.getPlayerCode().equals(playerCode));
	}

	public Board getBoard() {
		return board;
	}
	
	public static void prepareGameToStart(Game game) {
		game.setRound(ROUND_BEFORE_START);
	}
}
