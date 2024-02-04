package com.dainws.games.crm.persistence.memory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardCode;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorRarity;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.exception.CardNotFoundException;
import com.dainws.games.crm.domain.CardRepository;

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
		// TODO should use findWarriorsByRarity
		List<Card> cards = this.findWarriorsByRarity(rarity);

		// TODO Feat: List should be shorted randomly (shuffle) and get top one?
		int randomCardIndex = this.getRandomCardIndex(cards.size());
		return (Warrior) cards.get(randomCardIndex);
	}

	@Override
	public Equipment drawEquipment() {
		List<Card> cards = this.findByCardType(CardType.EQUIPMENT);

		// TODO Feat: List should be shorted randomly (shuffle) and get top one?
		int randomCardIndex = this.getRandomCardIndex(cards.size());
		return (Equipment) cards.get(randomCardIndex);
	}

	@Override
	public Leader drawLeader() {
		List<Card> cards = this.findByCardType(CardType.LEADER);

		// TODO Feat: List should be shorted randomly (shuffle) and get top one?
		int randomCardIndex = this.getRandomCardIndex(cards.size());
		return (Leader) cards.get(randomCardIndex);
	}

	@Override
	public Spell drawSpell() {
		List<Card> cards = this.findByCardType(CardType.SPELL);

		// TODO Feat: List should be shorted randomly (shuffle) and get top one?
		int randomCardIndex = this.getRandomCardIndex(cards.size());
		return (Spell) cards.get(randomCardIndex);
	}

	private int getRandomCardIndex(int maxIndex) {
		return new Random().nextInt(maxIndex);
	}
}
