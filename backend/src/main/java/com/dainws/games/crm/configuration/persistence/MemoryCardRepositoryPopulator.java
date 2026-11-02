package com.dainws.games.crm.configuration.persistence;

import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

/**
 * @deprecated to be removed once the party owner selects or uploads the deck
 *             that is kept in memory and used during their game.
 */
@Deprecated
public class MemoryCardRepositoryPopulator extends AbstractCardRepositoryPopulator<MemoryCardRepository> {
	@Override
	public void populate(MemoryCardRepository cardRepository) {
		this.addLeaders(cardRepository);
		this.addEquipments(cardRepository);
		this.addWarriors(cardRepository);
		this.addSpells(cardRepository);
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
		int code = 0;
		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(5)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(10)
				.withEquipment((Equipment) cardRepository.find(new CardCode(0, CardType.EQUIPMENT)))
				.build());

		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());

		cardRepository.set(Warrior.rareWarriorBuilder()
				.withCode(code++)
				.withPhysicalArmor(5)
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());

		cardRepository.set(Warrior.epicWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());

		cardRepository.set(Warrior.legendaryWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());

		cardRepository.set(Warrior.mythicWarriorBuilder()
				.withCode(code++)
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
	}

	private void addSpells(MemoryCardRepository cardRepository) {
		cardRepository.set(Spell.newInstance(0l, 1l));
		cardRepository.set(Spell.newInstance(1l, 2l));
	}
}
