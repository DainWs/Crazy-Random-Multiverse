package com.dainws.games.crm.domain.models.dealer;

import java.util.List;

import com.dainws.games.crm.domain.models.card.Card;

public interface DealStrategy {
	List<Card> drawFrom(Deck deck);
}
