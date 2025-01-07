package com.dainws.games.crm.tools.domain.core;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.GameModeStrategy;
import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.tools.domain.core.event.EventPublisherMonitor;
import com.dainws.games.crm.tools.domain.core.exception.ExceptionMonitor;

public class MonitoredGameStrategy implements GameModeStrategy {
	private GameModeStrategy wrapper;
	private ExceptionMonitor exceptionMonitor; 
	private EventPublisherMonitor eventPublisherMonitor;

	public MonitoredGameStrategy(GameModeStrategy wrapper) {
		this.wrapper = wrapper;
		this.exceptionMonitor = new ExceptionMonitor();
		this.eventPublisherMonitor = new EventPublisherMonitor();
	}
	
	@Override
	public GameMode getGameMode() {
		return this.wrapper.getGameMode();
	}

	@Override
	public Dealer createDealer() {
		return this.wrapper.createDealer();
	}

	@Override
	public Turn createTurn(PlayerStorage players) {
		return this.wrapper.createTurn(players);
	}

	@Override
	public Board createBoard(PlayerStorage players) {
		return this.wrapper.createBoard(players);
	}

	@Override
	public PlayerStorage createPlayerStorage() {
		return this.wrapper.createPlayerStorage();
	}

	@Override
	public EventPublisher createEventPublisher(Game game) {
		this.eventPublisherMonitor.setGame(game);
		return this.eventPublisherMonitor;
	}

	@Override
	public ExceptionPublisher createExceptionPublisher(Game game) {
		return this.exceptionMonitor;
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisherMonitor.setWrapper(eventPublisher);
	}
	
	public EventPublisherMonitor getEventPublisherMonitor() {
		return eventPublisherMonitor;
	}

	public void setExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		this.exceptionMonitor.setWrapper(exceptionPublisher);
	}
	
	public ExceptionMonitor getExceptionMonitor() {
		return exceptionMonitor;
	}
}
