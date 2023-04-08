package com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.DealRequest;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.DealStrategy;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.Deck;

public class ClassicDealStrategy implements DealStrategy {
	private Map<Integer, DealRequest[]> dealRequestsPerRound = new HashMap<>();
	private DealRequest[] defaultDealRequests;

	protected ClassicDealStrategy() {}

	public void setDealRequestsPerRound(int round, DealRequest... dealRequests) {
		this.dealRequestsPerRound.put(round, dealRequests);
	}

	public Map<Integer, DealRequest[]> getDealRequestsPerRound() {
		return dealRequestsPerRound;
	}

	public void setDefaultDealRequests(DealRequest... defaultDealRequests) {
		this.defaultDealRequests = defaultDealRequests;
	}

	public DealRequest[] getDefaultDealRequests() {
		return defaultDealRequests;
	}

	@Override
	public List<Card> executeStrategy(Deck deck, int round) {
		DealRequest[] roundDealRequests = this.dealRequestsPerRound.getOrDefault(round, this.defaultDealRequests);
		return this.executeStrategy(deck, roundDealRequests);
	}

	@Override
	public List<Card> executeStrategy(Deck deck, DealRequest... dealRequests) {
		List<Card> dealedCards = new ArrayList<>();
		for (DealRequest dealRequest : dealRequests) {
			for (int i = 0; i < dealRequest.getAmount(); i++) {
				Card card = deck.deal(dealRequest.getCardType(), dealRequest.getCardRarity());
				dealedCards.add(card);
			}
		}
		return dealedCards;
	}
}
