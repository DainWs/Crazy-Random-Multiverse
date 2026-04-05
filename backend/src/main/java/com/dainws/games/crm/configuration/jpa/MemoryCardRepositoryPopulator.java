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
		cardRepository.set(new Leader(0));
		cardRepository.set(new Leader(1));
	}

	private void addEquipments(MemoryCardRepository cardRepository) {
		cardRepository.set(Equipment.builder()
				.withCode(0)
//				.withName("Pistolón")
//				.withDescription("Arma a distancia")
				.withDamageBuff(15)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(1)
//				.withName("Espada")
//				.withDescription("Arma a cuerpo a cuerpo")
				.withDamageBuff(5)
				.build());

		cardRepository.set(Equipment.builder()
				.withCode(2)
//				.withName("Armadura de hierro")
//				.withDescription("Armadura de calidad media")
				.withArmorBuff(5)
				.build());
	}

	private void addWarriors(MemoryCardRepository cardRepository) throws NotFoundException {
		int code = 0;
		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(code++)
//				.withName("Hugo")
//				.withDescription("Un Humano")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(5)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(code++)
//				.withName("Perro")
//				.withDescription("Un animal fiero y fiel")
				.withNoneArmor()
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());

		cardRepository.set(Warrior.uncommonWarriorBuilder()
				.withCode(code++)
//				.withName("Policía")
//				.withDescription("Un Humano que se encarga de mantener el orden")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(10)
				.withEquipment((Equipment) cardRepository.find(new CardCode(0, CardType.EQUIPMENT)))
				.build());

		cardRepository.set(Warrior.commonWarriorBuilder()
				.withCode(code++)
//				.withName("Jose")
//				.withDescription("Un Humano")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
		
		cardRepository.set(Warrior.rareWarriorBuilder()
				.withCode(code++)
//				.withName("Zombie")
//				.withDescription("Un muerto viviente")
				.withPhysicalArmor(5)
				.withPhysicalDamage(10)
				.withHealth(10)
				.build());
		
		cardRepository.set(Warrior.epicWarriorBuilder()
				.withCode(code++)
//				.withName("Alien")
//				.withDescription("Un extraterrestre que ha venido a visitarnos desde otro planeta.")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
		
		cardRepository.set(Warrior.legendaryWarriorBuilder()
				.withCode(code++)
//				.withName("Argoth")
//				.withDescription("Argoth es un guerrero imponente, conocido en todo el reino por su estatura colosal y su armadura forjada en el fuego de las montañas sagradas. Su armadura negra reluce con inscripciones antiguas, cargadas de poder ancestral. En su pecho lleva grabado el símbolo de un trueno, un recordatorio de su vínculo con las fuerzas de la naturaleza.")
				.withNoneArmor()
				.withPhysicalDamage(5)
				.withHealth(15)
				.build());
		
		cardRepository.set(Warrior.mithicWarriorBuilder()
				.withCode(code++)
//				.withName("Odin")
//				.withDescription("Un dios de la mitología nórdica")
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
