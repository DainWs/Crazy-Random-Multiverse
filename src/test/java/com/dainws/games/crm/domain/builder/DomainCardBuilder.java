package com.dainws.games.crm.domain.builder;

import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;

public class DomainCardBuilder {
	
	public Leader buildFullValidLeader() {
		long code = (long)(Math.random() * 10000000);
		String name = "test_leader_"+code;
		String description = "test_leader_"+code+"_description";
		return new Leader(code, name, description);
	}
	
	public Warrior buildFullValidWarrior() {
		return new DomainWarriorBuilder()
				.shouldBeFullValid(true)
				.useRandomRarityWarrior()
				.build();
	}
	
	public DomainWarriorBuilder useWarrior() {
		return new DomainWarriorBuilder();
	}
	
	public Equipment buildFullValidEquipment() {
		long code = (long)(Math.random() * 10000000);
		return Equipment.builder()
				.withCode(code)
				.withName("test_equipment_"+code)
				.withDescription("test_equipment_"+code+"_description")
				.withDamageBuff(Math.random() * 20)
				.withArmorDebuff(Math.random() * 25)
				.build();
	}
	
	public Equipment.Builder useEquipment() {
		return Equipment.builder();
	}
	
	public Spell buildFullValidSpell() {
		long code = (long)(Math.random() * 10000000);
		long effectId = (long)(Math.random() * 10);
		return Spell.builder()
				.withCode(code)
				.withName("test_equipment_"+code)
				.withDescription("test_equipment_"+code+"_description")
				.withEffect(effectId)
				.build();
	}
	
	public Spell.Builder useSpell() {
		return Spell.builder();
	}
	
	public Card buildRandomFullValidCard() {
		List<Supplier<Card>> cardSuppliers = List.of(
				this::buildFullValidLeader,
				this::buildFullValidWarrior,
				this::buildFullValidEquipment,
				this::buildFullValidSpell
			);

		Collections.shuffle(cardSuppliers);
		return cardSuppliers.get(0).get();
	}
	
}
