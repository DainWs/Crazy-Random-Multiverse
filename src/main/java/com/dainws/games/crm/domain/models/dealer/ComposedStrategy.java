package com.dainws.games.crm.domain.models.dealer;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.models.card.Card;

public class ComposedStrategy implements DealStrategy {
	private List<DealStrategy> dealStrategies;

	public ComposedStrategy(List<DealStrategy> dealStrategies) {
		this.dealStrategies = dealStrategies;
	}

	public ComposedStrategy(DealStrategy... dealStrategies) {
		this.dealStrategies = new ArrayList<>();

		for (DealStrategy dealStrategy : dealStrategies) {
			this.dealStrategies.add(dealStrategy);
		}
	}

	@Override
	public List<Card> drawFrom(Deck deck) {
		List<Card> cards = new ArrayList<>();

		for (DealStrategy dealStrategy : this.dealStrategies) {
			cards.addAll(dealStrategy.drawFrom(deck));
		}

		return cards;
	}

}
