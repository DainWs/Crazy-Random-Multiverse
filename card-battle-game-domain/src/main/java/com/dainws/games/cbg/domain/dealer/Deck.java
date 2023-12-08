package com.dainws.games.cbg.domain.dealer;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Leader;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorRarity;
import com.dainws.games.cbg.domain.dealer.exception.DuplicatedCardException;
import com.dainws.games.cbg.domain.dealer.exception.EmptyDeckException;

public final class Deck {
	private Map<WarriorRarity, List<Warrior>> warriors;
	private List<Equipment> equipments;
	private List<Leader> leaders;
	private List<Spell> spells;

	private Deck() {
		this.equipments = new ArrayList<>();
		this.leaders = new ArrayList<>();
		this.spells = new ArrayList<>();

		this.warriors = new EnumMap<>(WarriorRarity.class);
		for (WarriorRarity rarity : WarriorRarity.values()) {
			this.warriors.put(rarity, new ArrayList<>());
		}
	}

	public Warrior getWarrior(WarriorRarity rarity) {
		List<Warrior> warriors = this.warriors.get(rarity);
		int randomCardIndex = this.getRandomCardIndex(warriors.size());
		return warriors.get(randomCardIndex);
	}

	public Equipment getEquipment() {
		int randomCardIndex = this.getRandomCardIndex(this.equipments.size());
		return this.equipments.get(randomCardIndex);
	}

	public Leader getLeader() {
		int randomCardIndex = this.getRandomCardIndex(this.leaders.size());
		return this.leaders.get(randomCardIndex);
	}

	public Spell getSpell() {
		int randomCardIndex = this.getRandomCardIndex(this.spells.size());
		return this.spells.get(randomCardIndex);
	}

	private int getRandomCardIndex(int maxIndex) {
		return new Random().nextInt(maxIndex);
	}

	public static Deck withCards(Set<Card> cards) throws EmptyDeckException {
		return new Builder().addCards(cards).build();
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Deck deck;

		public Builder() {
			this.deck = new Deck();
		}

		public Builder addCards(Set<Card> cards) {
			for (Card card : cards) {
				this.addCard(card);
			}
			return this;
		}

		public Builder addCard(Card card) {
			CardType cardType = card.getType();
			if (cardType.equals(CardType.SPELL)) {
				this.addCard((Spell) card);
			}

			if (cardType.equals(CardType.WARRIOR)) {
				this.addCard((Warrior) card);
			}

			if (cardType.equals(CardType.EQUIPMENT)) {
				this.addCard((Equipment) card);
			}

			if (cardType.equals(CardType.LEADER)) {
				this.addCard((Leader) card);
			}
			return this;
		}

		public Builder addCard(Warrior warrior) throws DuplicatedCardException {
			List<Warrior> warriorsWithSameRarity = this.deck.warriors.get(warrior.getRarity());
			if (warriorsWithSameRarity.contains(warrior)) {
				throw new DuplicatedCardException(warrior);
			}

			warriorsWithSameRarity.add(warrior);
			return this;
		}

		public Builder addCard(Equipment equipment) throws DuplicatedCardException {
			if (this.deck.equipments.contains(equipment)) {
				throw new DuplicatedCardException(equipment);
			}

			this.deck.equipments.add(equipment);
			return this;
		}

		public Builder addCard(Leader leader) throws DuplicatedCardException {
			if (this.deck.leaders.contains(leader)) {
				throw new DuplicatedCardException(leader);
			}

			this.deck.leaders.add(leader);
			return this;
		}

		public Builder addCard(Spell spell) throws DuplicatedCardException {
			if (this.deck.spells.contains(spell)) {
				throw new DuplicatedCardException(spell);
			}

			this.deck.spells.add(spell);
			return this;
		}

		public Deck build() throws EmptyDeckException {
			if (this.isDeckEmpty()) {
				throw new EmptyDeckException();
			}

			return this.deck;
		}

		private boolean isDeckEmpty() {
			boolean hasNoneSpells = this.deck.spells.isEmpty();
			boolean hasNoneEquipments = this.deck.equipments.isEmpty();
			boolean hasNoneWarrior = true;
			for (Entry<WarriorRarity, List<Warrior>> entry : this.deck.warriors.entrySet()) {
				if (!entry.getValue().isEmpty()) {
					hasNoneWarrior = false;
				}
			}
			return hasNoneSpells && hasNoneEquipments && hasNoneWarrior;
		}
	}
}
