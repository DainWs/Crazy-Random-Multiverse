package com.dainws.games.crm.domain.core;

import java.util.Random;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.ZoneFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;

public class DummyGameStrategy implements GameModeStrategy {
	private static final Random RANDOM = new Random(1L);
	public static final GameMode DUMMY_MODE = new GameMode("DUMMY_MODE");
	public static final int STARTING_ROUND = 0;

	private Dealer dealer;
	private ZoneFactory zoneFactory;
	private PlayerStorage players;

	private EventPublisher eventPublisher;

	@Override
	public GameMode getGameMode() {
		return DUMMY_MODE;
	}

	@Override
	public Dealer createDealer() {
		return this.dealer;
	}

	public void setDealer(Dealer dealer) {
		this.dealer = dealer;
	}

	@Override
	public Turn createTurn(PlayerStorage players) {
		int index = RANDOM.nextInt(players.size());
		Player playerWithTurn = players.get(index);
		return new Turn(players, playerWithTurn, STARTING_ROUND);
	}

	@Override
	public Board createBoard(PlayerStorage players) {
		return new Board(this.zoneFactory::create, players);
	}

	public void setZoneFactory(ZoneFactory zoneFactory) {
		this.zoneFactory = zoneFactory;
	}

	@Override
	public PlayerStorage createPlayerStorage() {
		return this.players;
	}

	public void setPlayers(PlayerStorage players) {
		this.players = players;
	}

	@Override
	public EventPublisher createEventPublisher(Game game) {
		return this.eventPublisher;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
