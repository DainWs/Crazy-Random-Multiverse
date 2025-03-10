package com.dainws.games.crm.domain.mode.aivsai;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.mode.GameModeFactory;

public class AIvsAIGameModeFactory implements GameModeFactory {

	private Deck deck;
	private EventPublisher eventPublisher;
	private ExceptionPublisher exceptionPublisher;

	public AIvsAIGameModeFactory(Deck deck) {
		this.deck = deck;
		this.eventPublisher = EventPublisher.NONE;
		this.exceptionPublisher = ExceptionPublisher.NONE;
	}

	@Override
	public GameMode getMode() {
		return AIvsAIGameStrategy.AIVSAI_MODE;
	}

	@Override
	public Game createGame(Party party) {
		return this.createGame(party, this.deck);
	}

	@Override
	public Game createGame(Party party, Deck deck) {
		AIvsAIGameStrategy strategy = new AIvsAIGameStrategy(party, deck);
		strategy.setEventPublisher(this.eventPublisher);
		strategy.setExceptionPublisher(this.exceptionPublisher);

		return new Game(strategy);
	}

	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setExceptionPublisher(ExceptionPublisher exceptionPublisher) {
		this.exceptionPublisher = exceptionPublisher;
	}

}
