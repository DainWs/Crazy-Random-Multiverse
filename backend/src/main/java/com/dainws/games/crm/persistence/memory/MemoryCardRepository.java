package com.dainws.games.crm.persistence.memory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.repositories.CardRepository;

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
	public Card find(CardCode cardCode) throws NotFoundException {
		System.out.println("aa "+ cardCode);
		if (this.has(cardCode)) {
			return this.findCopyOf(cardCode);
		}
		
		for (Entry<CardCode, Card> a : cards.entrySet()) {
			System.out.println(a.getKey() + " - " + a.getValue());
		}

		throw NotFoundException.cardNotFound();
	}
	
	private Card findCopyOf(CardCode cardCode) throws NotFoundException {
		Card card = this.cards.get(cardCode);

		if (cardCode.isType(CardType.WARRIOR)) {
			return this.cloneWarrior(card);
		}

		if (cardCode.isType(CardType.SPELL)) {
			return this.cloneSpell(card);
		}

		if (cardCode.isType(CardType.EQUIPMENT)) {
			return this.cloneEquipment(card);
		}

		return this.cloneLeader(card);
	}

	@Override
	public List<Card> findAll() {
		return this.cards.values().stream()
				.distinct()
				.collect(Collectors.toList());
	}

	@Override
	public List<Card> findByCardType(CardType cardType) {
		return this.findAll().stream()
				.filter(card -> card.isType(cardType))
				.collect(Collectors.toList());
	}

	@Override
	public List<Card> findWarriorsByRarity(WarriorRarity rarity) {
		return this.findByCardType(CardType.WARRIOR).stream()
				.map(warriorCard -> (Warrior) warriorCard)
				.filter(warrior -> warrior.isRarity(rarity))
				.collect(Collectors.toList());
	}

	@Override
	public Warrior drawWarrior(WarriorRarity rarity) {
		List<Card> cards = this.findWarriorsByRarity(rarity);

		Collections.shuffle(cards);
		return this.cloneWarrior(cards.get(0));
	}

	@Override
	public Equipment drawEquipment() {
		List<Card> cards = this.findByCardType(CardType.EQUIPMENT);

		Collections.shuffle(cards);
		return this.cloneEquipment(cards.get(0));
	}

	@Override
	public Leader drawLeader() {
		List<Card> cards = this.findByCardType(CardType.LEADER);

		Collections.shuffle(cards);
		return this.cloneLeader(cards.get(0));
	}

	@Override
	public Spell drawSpell() {
		List<Card> cards = this.findByCardType(CardType.SPELL);

		Collections.shuffle(cards);
		return this.cloneSpell(cards.get(0));
	}

	private Spell cloneSpell(Card card) {
		Spell prototype = (Spell) card;
		CardCode cardCode = prototype.getCode();
		return Spell.newIntance(cardCode.code(), prototype.getEffectId());
	}

	private Equipment cloneEquipment(Card card) {
		Equipment prototype = (Equipment) card;
		CardCode cardCode = prototype.getCode();
		return Equipment.builder()
				.withCode(cardCode.code())
				.withDamage(prototype.getDamageValue())
				.withArmor(prototype.getArmorValue())
				.withHealth(prototype.getHealthValue())
				.build();
	}

	private Leader cloneLeader(Card card) {
		return new Leader(card.getCode().code());
	}

	private Warrior cloneWarrior(Card card) {
		Warrior prototype = (Warrior) card;
		CardCode cardCode = prototype.getCode();
		return Warrior.warriorBuilder(prototype.getRarity())
				.withCode(cardCode.code())
				.withDamage(prototype.getDamage())
				.withArmor(prototype.getArmor())
				.withHealth(prototype.getHealth())
				.withEquipment(prototype.getEquipment())
				.build();
	}
}
