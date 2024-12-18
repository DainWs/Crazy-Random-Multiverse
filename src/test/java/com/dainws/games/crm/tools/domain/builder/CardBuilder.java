package com.dainws.games.crm.tools.domain.builder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Supplier;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.Spell;
import com.dainws.games.crm.domain.core.card.Warrior;

public class CardBuilder {
	
	public Leader buildFullValidLeader() {
		long code = (long)(Math.random() * 10000000);
		return new Leader(code);
	}
	
	public Warrior buildFullValidWarrior() {
		return new WarriorBuilder()
				.shouldBeFullValid(true)
				.useRandomRarityWarrior()
				.build();
	}
	
	public WarriorBuilder useWarrior() {
		return new WarriorBuilder();
	}
	
	public Equipment buildFullValidEquipment() {
		long code = (long)(Math.random() * 10000000);
		return Equipment.builder()
				.withCode(code)
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
		return Spell.newIntance(code, effectId);
	}
	
	public Card buildRandomFullValidCard() {
		List<Supplier<Card>> cardSuppliers = new ArrayList<>();
		cardSuppliers.add(this::buildFullValidLeader);
		cardSuppliers.add(this::buildFullValidWarrior);
		cardSuppliers.add(this::buildFullValidEquipment);
		cardSuppliers.add(this::buildFullValidSpell);

		Collections.shuffle(cardSuppliers);
		return cardSuppliers.get(0).get();
	}
	
}
