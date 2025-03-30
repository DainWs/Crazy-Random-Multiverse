package com.dainws.games.crm.domain.mode.pvsai;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.GameModes;

public class PvsAIGameModeFactory implements GameModeFactory {

	private Deck deck;
	private EventPublisher eventPublisher;
	private ExceptionPublisher exceptionPublisher;

	public PvsAIGameModeFactory(Deck deck) {
		this.deck = deck;
		this.eventPublisher = EventPublisher.NONE;
		this.exceptionPublisher = ExceptionPublisher.NONE;
	}

	@Override
	public GameMode getMode() {
		return GameModes.PLAYER_VS_AI;
	}

	@Override
	public Game createGame(Party party) {
		return this.createGame(party, this.deck);
	}
	
	@Override
	public Game createGame(Party party, Deck deck) {
		System.out.println("Strategy");
		PvsAIGameStrategy strategy = new PvsAIGameStrategy(party, deck);
		strategy.setEventPublisher(this.eventPublisher);
		strategy.setExceptionPublisher(this.exceptionPublisher);
		System.out.println("End Strategy");
		return new Game(strategy);
	}
	
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		this.exceptionPublisher = exceptionPublisher;
	}
}
