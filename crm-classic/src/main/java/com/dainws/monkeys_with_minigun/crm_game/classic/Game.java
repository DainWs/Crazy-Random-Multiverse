package com.dainws.monkeys_with_minigun.crm_game.classic;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal.ClassicDealStrategyFactory;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal.ClassicDeck;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.DealStrategy;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.Dealer;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.Deck;

public class Game {
	public static void main(String[] args) {
		
		Deck deck = new ClassicDeck(null);
		DealStrategy dealStrategy = new ClassicDealStrategyFactory().create();
		Dealer dealer = new Dealer(deck, dealStrategy);
		
		System.out.println(dealer.deal(0).get(0).getType());
		
	}
}
