package com.dainws.monkeys_with_minigun.crm_game.classic.domain.deal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Stream;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.ClassicCardRarity;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.ClassicCardTypes;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports.CardRepository;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardType;
import com.dainws.monkeys_with_minigun.crm_game.domain.deal.Deck;

public class ClassicDeck implements Deck {

	// TODO hacer

	private List<Card> leaders = new ArrayList<>();
	private List<Card> equipments = new ArrayList<>();
	private List<Card> spells = new ArrayList<>();
	private Map<CardRarity, List<Card>> warriors = new HashMap<>();

	public ClassicDeck(CardRepository provider) {
		this.leaders = provider.provideAllLeaders();
		this.equipments = provider.provideAllEquipments();
		this.spells = provider.provideAllSpells();

		Stream.of(ClassicCardRarity.values())
			.filter(Predicate.not(ClassicCardRarity.NORMAL::equals))
			.forEach(r -> this.warriors.put(r, provider.provideAllWarriors(r)));
	}

	@Override
	public Card deal(CardType cardType, CardRarity cardRarity) {
		if (ClassicCardTypes.LEADER.equals(cardType)) {
			return this.deal(this.leaders);
		}

		if (ClassicCardTypes.EQUIPMENT.equals(cardType)) {
			return this.deal(this.equipments);
		}

		if (ClassicCardTypes.SPELL.equals(cardType)) {
			return this.deal(this.spells);
		}

		if (ClassicCardTypes.WARRIOR.equals(cardType)) {
			return this.deal(this.warriors.get(cardRarity));
		}

		throw new IllegalArgumentException("Card type " + cardType + " was unexpected, expecting ClassicCardType type");
	}

	private Card deal(List<Card> card) {
		return null;
	}
}
