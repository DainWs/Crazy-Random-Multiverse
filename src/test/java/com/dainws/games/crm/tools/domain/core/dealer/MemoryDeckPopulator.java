package com.dainws.games.crm.tools.domain.core.dealer;

import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

public class MemoryDeckPopulator extends AbstractDeckPopulator {

	@Override
	public Deck populate() {
		MemoryCardRepository deck = new MemoryCardRepository();
		try {
			this.addLeaders(deck);
			this.addEquipments(deck);
			this.addWarriors(deck);
			this.addSpells(deck);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return deck;
	}

	private void addLeaders(MemoryCardRepository cardRepository) {
		cardRepository.set(new Leader(0));
		cardRepository.set(new Leader(1));
	}

	private void addEquipments(MemoryCardRepository cardRepository) {
		cardRepository.set(Equipment.builder()
				.withCode(0)
				.withDamageBuff(15)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(1)
				.withDamageBuff(5)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(2)
				.withArmorBuff(5)
				.build());
	}

	private void addWarriors(MemoryCardRepository cardRepository) throws NotFoundException {
		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(0)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(5)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(1)
				.withNoneArmor()
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(2)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(10)
				.withEquipment((Equipment) cardRepository.find(new CardCode(0, CardType.EQUIPMENT)))
				.build());

		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(3)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
	}

	private void addSpells(MemoryCardRepository cardRepository) {
		cardRepository.set(Spell.newIntance(0l, 1l));
		cardRepository.set(Spell.newIntance(1l, 2l));
	}

}
