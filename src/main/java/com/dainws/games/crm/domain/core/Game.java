package com.dainws.games.crm.domain.core;

import java.util.List;
import java.util.function.Predicate;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public abstract class Game {
	private GameCode code;
	private EventPublisher eventPublisher;

	protected Game() {
		this(new GameCode());
	}

	protected Game(GameCode code) {
		this.code = code;
	}

	public final void publishEvent(EventCode code) {
		EventDetails details = new EventDetails(this);
		this.eventPublisher.publish(code, details);
	}

	public final void publishEvent(EventCode code, EventDetails details) {
		details.setGameContext(this);
		this.eventPublisher.publish(code, details);
	}

	public abstract boolean isRunning();
	
	public abstract Player getPlayerWithTurn();
	
	public abstract Player getPlayer(PlayerCode code);

	public abstract PlayerStorage getPlayers();

	public abstract PlayerStorage getPlayers(Predicate<Player> thatMatchs);

	public abstract PlayerStorage getAlivePlayers();

	public abstract List<Player> getDeathPlayers();

	public abstract int countPlayers();

	public abstract int countAlivePlayers();

	public abstract int countDeathPlayers();

	public abstract Dealer getDealer();

	public abstract Board getBoard();

	public abstract Zone getPlayerZone(Player player);

	public abstract Turn getTurn();

	public abstract int getRoundNumber();

	public abstract int getTurnNumber();

	public abstract GameMode getMode();

	public final GameCode getCode() {
		return this.code;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
