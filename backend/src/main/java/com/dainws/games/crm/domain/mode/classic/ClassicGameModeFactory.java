package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.exception.PartyExceptionCode;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.GameModes;

public class ClassicGameModeFactory implements GameModeFactory {

	private Deck deck;
	private EventPublisher eventPublisher;

	public ClassicGameModeFactory(Deck deck) {
		this.deck = deck;
		this.eventPublisher = EventPublisher.NONE;
	}

	@Override
	public GameMode getMode() {
		return GameModes.CLASSIC;
	}

	@Override
	public Game createGame(Party party) throws NotAllowedException {
		return this.createGame(party, this.deck);
	}
	
	@Override
	public Game createGame(Party party, Deck deck) throws NotAllowedException {
		if (deck.drawLeader().isEmpty()) {
			throw new NotAllowedException(PartyExceptionCode.DECK_WITHOUT_LEADER);
		}

		ClassicModeStrategy strategy = new ClassicModeStrategy(party, deck);
		strategy.setEventPublisher(this.eventPublisher);

		return new Game(strategy);
	}
	
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

}
