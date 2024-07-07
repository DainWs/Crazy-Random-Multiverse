package com.dainws.games.crm.persistence.memory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.dainws.games.crm.domain.exception.CardNotFoundException;
import com.dainws.games.crm.domain.models.card.Card;
import com.dainws.games.crm.domain.models.card.CardCode;
import com.dainws.games.crm.domain.models.card.CardType;
import com.dainws.games.crm.domain.models.card.Equipment;
import com.dainws.games.crm.domain.models.card.Leader;
import com.dainws.games.crm.domain.models.card.Spell;
import com.dainws.games.crm.domain.models.card.Warrior;
import com.dainws.games.crm.domain.models.card.WarriorRarity;
import com.dainws.games.crm.domain.models.dealer.Deck;
import com.dainws.games.crm.persistence.repositories.CardRepository;

public class MemoryCardRepository implements CardRepository, Deck {
	private Map<CardCode, Card> cards;

	public MemoryCardRepository() {
		this.cards = new HashMap<>();
	}

	public void set(Card card) {
		this.cards.put(card.getCode(), card);
	}

	public void remove(CardCode cardCode) {
		this.cards.remove(cardCode);
	}

	@Override
	public boolean has(CardCode cardCode) {
		return this.cards.containsKey(cardCode);
	}

	@Override
	public Card find(CardCode cardCode) throws CardNotFoundException {
		if (this.has(cardCode)) {
			return this.cards.get(cardCode);
		}

		throw new CardNotFoundException();
	}

	@Override
	public List<Card> findAll() {
		return this.cards.values().stream()
				.distinct()
				.collect(Collectors.toUnmodifiableList());
	}

	@Override
	public List<Card> findByCardType(CardType cardType) {
		return this.findAll().stream()
				.filter(card -> card.isType(cardType))
				.collect(Collectors.toUnmodifiableList());
	}

	@Override
	public List<Card> findWarriorsByRarity(WarriorRarity rarity) {
		return this.findByCardType(CardType.WARRIOR).stream()
				.map(warriorCard -> (Warrior) warriorCard)
				.filter(warrior -> warrior.isRarity(rarity))
				.collect(Collectors.toUnmodifiableList());
	}

	@Override
	public Warrior drawWarrior(WarriorRarity rarity) {
		List<Card> cards = this.findWarriorsByRarity(rarity);

	    Collections.shuffle(cards);
		return (Warrior) cards.get(0);
	}

	@Override
	public Equipment drawEquipment() {
		List<Card> cards = this.findByCardType(CardType.EQUIPMENT);

	    Collections.shuffle(cards);
		return (Equipment) cards.get(0);
	}

	@Override
	public Leader drawLeader() {
		List<Card> cards = this.findByCardType(CardType.LEADER);

	    Collections.shuffle(cards);
		return (Leader) cards.get(0);
	}

	@Override
	public Spell drawSpell() {
		List<Card> cards = this.findByCardType(CardType.SPELL);

	    Collections.shuffle(cards);
		return (Spell) cards.get(0);
	}
}
