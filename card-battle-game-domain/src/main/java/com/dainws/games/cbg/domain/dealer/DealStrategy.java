package com.dainws.games.cbg.domain.dealer;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;

public interface DealStrategy {
	List<Card> dealFrom(Deck deck);
}
