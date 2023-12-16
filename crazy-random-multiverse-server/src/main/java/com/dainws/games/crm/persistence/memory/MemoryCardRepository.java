package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorRarity;
import com.dainws.games.cbg.domain.exception.CardNotFoundException;
import com.dainws.games.crm.persistence.CardRepository;

public class MemoryCardRepository implements CardRepository {
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
	public Set<Card> findAll() {
		return Set.copyOf(this.cards.values());
	}
	
	@Override
	public Set<Card> findByCardType(CardType cardType) {
		return this.findAll().stream()
			.filter(card -> card.isType(cardType))
			.collect(Collectors.toSet());
	}
	
	@Override
	public Set<Card> findWarriorsByRarity(WarriorRarity rarity) {
		return this.findByCardType(CardType.WARRIOR).stream()
				.map(warriorCard -> (Warrior) warriorCard)
				.filter(warrior -> warrior.isRarity(rarity))
				.collect(Collectors.toSet());
	}
}
