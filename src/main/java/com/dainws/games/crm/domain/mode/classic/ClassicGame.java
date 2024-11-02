package com.dainws.games.crm.domain.mode.classic;

import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class ClassicGame extends Game {
	public static final GameMode CLASSIC_GAME_MODE = new GameMode("CLASSIC");

	protected boolean isRunning;
	protected Turn turn;
	protected Board board;
	protected Dealer dealer;
	protected PlayerStorage players;

	public ClassicGame(Dealer dealer, Collection<Player> players) {
		super();
		this.isRunning = true;
		this.dealer = dealer;
		this.players = new PlayerStorage(players);
		this.board = new Board(this.players);
		this.turn = new Turn(this.players);
	}

	public ClassicGame(GameCode code, Dealer dealer, Collection<Player> players) {
		super(code);
		this.isRunning = true;
		this.dealer = dealer;
		this.players = new PlayerStorage(players);
		this.board = new Board(this.players);
		this.turn = new Turn(this.players);
	}
	
	public void stopRunning() {
		this.isRunning = false;
	}
	
	@Override
	public boolean isRunning() {
		return this.isRunning;
	}

	@Override
	public GameMode getMode() {
		return CLASSIC_GAME_MODE;
	}
	
	@Override
	public Player getPlayerWithTurn() {
		return this.turn.getPlayerWithTurn(this.players);
	}
	
	@Override
	public Player getPlayer(PlayerCode code) {
		return this.players.firstMatch(player -> player.isCode(code));
	}

	@Override
	public PlayerStorage getPlayers() {
		return this.players;
	}

	@Override
	public PlayerStorage getPlayers(Predicate<Player> thatMatchs) {
		return this.players.filter(thatMatchs);
	}

	@Override
	public PlayerStorage getAlivePlayers() {
		return this.players.filter(Player::isAlive);
	}

	@Override
	public List<Player> getDeathPlayers() {
		return this.players.filter(Player::isDeath);
	}

	@Override
	public int countPlayers() {
		return this.players.size();
	}

	@Override
	public int countAlivePlayers() {
		return this.players.countMatch(Player::isAlive);
	}

	@Override
	public int countDeathPlayers() {
		return this.players.countMatch(Player::isDeath);
	}

	@Override
	public Dealer getDealer() {
		return this.dealer;
	}
	
	public void setBoard(Board board) {
		this.board = board;
	}

	@Override
	public Board getBoard() {
		return board;
	}

	@Override
	public Zone getPlayerZone(Player player) {
		return this.board.getZoneOf(player);
	}

	public void setTurn(Turn turn) {
		this.turn = turn;
	}

	@Override
	public Turn getTurn() {
		return turn;
	}

	@Override
	public int getRoundNumber() {
		return this.turn.getRoundNumber();
	}

	@Override
	public int getTurnNumber() {
		return this.turn.getTurnNumber();
	}
}
