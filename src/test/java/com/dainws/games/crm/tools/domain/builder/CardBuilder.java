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
		long code = (long) (Math.random() * 10000000);
		return new Leader(code);
	}

	public Warrior buildFullValidWarrior() {
		return new WarriorBuilder().shouldBeFullValid(true).useRandomRarityWarrior().build();
	}

	public WarriorBuilder useWarrior() {
		return new WarriorBuilder();
	}

	public Equipment buildFullValidEquipment() {
		long code = (long) (Math.random() * 10000000);
		return Equipment.builder()
				.withCode(code)
				.withDamageBuff(this.toValidDouble((Math.random() + 1) * 20))
				.withArmorBuff(this.toValidDouble((Math.random() + 1) * 25))
				.build();
	}

	private double toValidDouble(double value) {
		return Math.floor(Math.abs(value) * 100) / 100;
	}

	public Equipment.Builder useEquipment() {
		return Equipment.builder();
	}

	public Spell buildFullValidSpell() {
		long code = (long) (Math.random() * 10000000);
		long effectId = (long) (Math.random() * 10);
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

	public static Leader buildLeader() {
		return new CardBuilder().buildFullValidLeader();
	}

	public static Equipment buildEquipment() {
		return new CardBuilder().buildFullValidEquipment();
	}

	public static Spell buildSpell() {
		return new CardBuilder().buildFullValidSpell();
	}

	public static Warrior buildCommonWarrior() {
		return new WarriorBuilder().useCommonWarrior().build();
	}

	public static Warrior buildUncommonWarrior() {
		return new WarriorBuilder().useUncommonWarrior().build();
	}

	public static Warrior buildRareWarrior() {
		return new WarriorBuilder().useRareWarrior().build();
	}

	public static Warrior buildEpicWarrior() {
		return new WarriorBuilder().useEpicWarrior().build();
	}

	public static Warrior buildLegendaryWarrior() {
		return new WarriorBuilder().useLegendaryWarrior().build();
	}

	public static Warrior buildMithicWarrior() {
		return new WarriorBuilder().useMithicWarrior().build();
	}
}
