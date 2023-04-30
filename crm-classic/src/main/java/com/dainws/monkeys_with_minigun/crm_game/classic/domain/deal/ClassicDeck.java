package com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.ClassicCardTypes;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports.CardRepository;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardType;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.Deck;

public class ClassicDeck implements Deck {

	// TODO hacer
	private CardRepository repository;

	public ClassicDeck(CardRepository repository) {
		this.repository = repository;
	}

	@Override
	public Card deal(CardType cardType, CardRarity cardRarity) {
		if (ClassicCardTypes.LEADER.equals(cardType)) {
			return this.deal(this.repository.provideLeaders());
		}

		if (ClassicCardTypes.EQUIPMENT.equals(cardType)) {
			return this.deal(this.repository.provideEquipments());
		}

		if (ClassicCardTypes.SPELL.equals(cardType)) {
			return this.deal(this.repository.provideSpells());
		}

		if (ClassicCardTypes.WARRIOR.equals(cardType)) {
			return this.deal(this.repository.provideWarriors(cardRarity));
		}

		throw new IllegalArgumentException("Card type " + cardType + " was unexpected, expecting ClassicCardType type");
	}

	private Card deal(List<? extends Card> card) {
		return null;
	}
}
