package com.dainws.games.crm.configuration.jpa;

import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

public class MemoryCardRepositoryPopulator extends AbstractCardRepositoryPopulator<MemoryCardRepository> {

	@Override
	public void populate(MemoryCardRepository cardRepository) {
		try {
			this.addLeaders(cardRepository);
			this.addEquipments(cardRepository);
			this.addWarriors(cardRepository);
			this.addSpells(cardRepository);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void addLeaders(MemoryCardRepository cardRepository) {
		cardRepository.set(new Leader(0, "JaDicter", "Un lider alto y delgado"));
		cardRepository.set(new Leader(1, "JaChin", "Un lider bajito y gordito"));
	}

	private void addEquipments(MemoryCardRepository cardRepository) {
		cardRepository.set(Equipment.builder()
				.withCode(0)
				.withName("Pistolón")
				.withDescription("Arma a distancia")
				.withDamageBuff(15)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(1)
				.withName("Espada")
				.withDescription("Arma a cuerpo a cuerpo")
				.withDamageBuff(5)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(2)
				.withName("Armadura de hierro")
				.withDescription("Armadura de calidad media")
				.withArmorBuff(5)
				.build());
	}

	private void addWarriors(MemoryCardRepository cardRepository) throws NotFoundException {
		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(0)
				.withName("Hugo")
				.withDescription("Un Humano")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(5)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(1)
				.withName("Perro")
				.withDescription("Un animal fiero y fiel")
				.withNoneArmor()
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(2)
				.withName("Policía")
				.withDescription("Un Humano que se encarga de mantener el orden")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(10)
				.withEquipment((Equipment) cardRepository.find(new CardCode(0, CardType.EQUIPMENT)))
				.build());

		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(3)
				.withName("Jose")
				.withDescription("Un Humano")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
	}

	private void addSpells(MemoryCardRepository cardRepository) {
		cardRepository.set(Spell.builder()
				.withCode(0)
				.withName("Cartas")
				.withDescription("Recibes 1 carta común")
				.withEffect(1)
				.build());

		cardRepository.set(Spell.builder()
				.withCode(1)
				.withName("Cartas")
				.withDescription("Recibes 1 carta poco común")
				.withEffect(2)
				.build());
	}
}
