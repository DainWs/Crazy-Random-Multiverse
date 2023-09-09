package com.dainws.games.cbg.domain.dealer;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;

public final class Dealer {
	private Deck deck;
	private DealStrategy strategy;
	
	public Dealer(Deck deck) {
		this.deck = deck;
	}
	
	public void setStrategy(DealStrategy strategy) {
		this.strategy = strategy;
	}
	
	public void dealTo(Player player) {
		List<Card> cards = this.strategy.dealFrom(this.deck);
		Hand hand = player.getHand();
		hand.addCards(cards);
	}
}
