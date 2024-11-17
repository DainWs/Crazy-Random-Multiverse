package com.dainws.games.crm.domain.core;

import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class Game {
	private GameCode code;
	private GameMode gameMode;
	private Status status;

	private boolean isRunning;
	private Turn turn;
	private Board board;
	private Dealer dealer;
	private PlayerStorage players;
	private EventPublisher eventPublisher;
	private ExceptionPublisher exceptionPublisher;

	public Game(GameModeStrategy strategy) {
		this(new GameCode(), strategy);
	}

	public Game(GameCode code, GameModeStrategy strategy) {
		this.code = code;
		this.status = Status.NONE;
		this.gameMode = strategy.getGameMode();
		this.isRunning = true;

		this.dealer = strategy.createDealer();
		this.players = strategy.createPlayerStorage();
		this.board = strategy.createBoard(this.players);
		this.turn = strategy.createTurn(this.players);

		this.eventPublisher = strategy.createEventPublisher(this);
		this.exceptionPublisher = strategy.createExceptionPublisher(this);
	}

	void reset() { // TODO review
		this.turn = new Turn(this.getAlivePlayers());
	}
	
	public boolean inStatus(Status status) {
		return this.status.equals(status);
	}

	public boolean hasStarted() {
		if (this.hasEnded()) {
			return true;
		}

		return this.inStatus(Status.IN_PROGRESS);
	}

	public boolean hasEnded() {
		return this.inStatus(Status.ENDED);
	}

	public void publishEvent(EventCode code) {
		EventDetails details = new EventDetails(this);
		this.eventPublisher.publish(code, details);
	}

	public void publishEvent(EventCode code, EventDetails details) {
		details.setGame(this);
		this.eventPublisher.publish(code, details);
	}

	public void publishException(ExceptionCode exceptionCode) {
		this.exceptionPublisher.publish(this.players, exceptionCode);
	}

	public void publishException(Player player, ExceptionCode exceptionCode) {
		if (!this.players.contains(player)) {
			throw NotFoundException.playerNotFound();
		}

		this.exceptionPublisher.publish(player, exceptionCode);
	}

	void stopRunning() {
		this.isRunning = false;
	}

	public boolean isRunning() { // TODO possible alternative with status
		return this.isRunning;
	}

	public GameMode getMode() {
		return this.gameMode;
	}

	public Player getPlayerWithTurn() {
		return this.turn.getPlayerWithTurn(this.players);
	}

	public Player getPlayer(PlayerCode code) {
		return this.players.firstMatch(player -> player.isCode(code));
	}

	public PlayerStorage getPlayers() {
		return this.players;
	}

	public PlayerStorage getPlayers(Predicate<Player> thatMatchs) {
		return this.players.filter(thatMatchs);
	}

	public PlayerStorage getAlivePlayers() {
		return this.players.filter(Player::isAlive);
	}

	public List<Player> getDeathPlayers() {
		return this.players.filter(Player::isDeath);
	}

	public int countPlayers() {
		return this.players.size();
	}

	public int countAlivePlayers() {
		return this.players.countMatch(Player::isAlive);
	}

	public int countDeathPlayers() {
		return this.players.countMatch(Player::isDeath);
	}

	public Dealer getDealer() {
		return this.dealer;
	}

	public void setBoard(Board board) {
		this.board = board;
	}

	public Board getBoard() {
		return board;
	}

	public Zone getPlayerZone(Player player) {
		return this.board.getZoneOf(player);
	}
	
	void setTurn(Turn turn) {
		this.turn = turn;
	}

	public Turn getTurn() {
		return turn;
	}

	public int getRoundNumber() {
		return this.turn.getRoundNumber();
	}

	public int getTurnNumber() {
		return this.turn.getTurnNumber();
	}

	public GameCode getCode() {
		return this.code;
	}
	
	void setStatus(Status status) {
		this.status = status;
	}
}
