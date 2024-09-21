package com.dainws.games.crm.domain.core;

import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.exception.IllegalTimeChangeException;
import com.dainws.games.crm.domain.exception.PlayerNotFoundException;

public class Game {
	private GameCode code;
	private GameState state;
	private int playerIndexWithTurn;
	private int round;

	private Board board;
	private List<Player> players;

	public Game(List<Player> players) {
		this.code = new GameCode();
		this.state = GameState.BEFORE_START;
		this.round = 0;
		this.playerIndexWithTurn = 0;
		this.players = players;
		this.board = new Board(players);
	}

	public void resetTime() {
		this.round = 0;
		this.playerIndexWithTurn = 0;
	}
	
	public boolean inState(GameState state) {		
		return this.state.equals(state);
	}
	
	public GameCode getCode() {
		return code;
	}
	
	public GameState getState() {
		return state;
	}
	
	public void setState(GameState state) {
		if (GameState.BEFORE_START.equals(state)) {
			this.resetTime();
		}

		this.state = state;
	}

	public int getRound() {
		return round;
	}

	public void setRound(int round) throws IllegalTimeChangeException {
		if (!this.inState(GameState.IN_PROGRESS)) {
			throw new IllegalTimeChangeException();
		}

		this.round = round;
	}

	public int getTurn() {
		return playerIndexWithTurn;
	}

	public void setTurn(int turn) {
		if (!this.inState(GameState.IN_PROGRESS)) {
			throw new IllegalTimeChangeException();
		}

		this.playerIndexWithTurn = turn;
	}

	public List<Player> getPlayers() {
		return List.copyOf(this.players);
	}
	
	public List<Player> getAlivePlayers() {
		return this.players.stream()
				.filter(this::isPlayerAlive)
				.toList();
	}
	
	public List<Player> getDeathPlayers() {
		return this.players.stream()
				.filter(Predicate.not(this::isPlayerAlive))
				.toList();
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
	
	private boolean isPlayerAlive(Player player) {
		return this.isPlayerAlive(player.getPlayerCode());
	}
	
	public boolean isPlayerAlive(PlayerCode playerCode) {
		if (this.board.hasZoneOf(playerCode)) {
			return this.board.isZoneAlive(playerCode);
		}

		return false;
	}

	public Board getBoard() {
		return board;
	}
}
