package com.dainws.games.crm.domain.core.dealer;

import java.util.List;

import com.dainws.games.crm.domain.core.card.Card;

public interface DealStrategy {
	List<Card> drawFrom(Deck deck);
}
