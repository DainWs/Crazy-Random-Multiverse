package com.dainws.games.crm.tools.domain.builder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class WarriorBuilder {

	private boolean shouldBeValid;
	
	public WarriorBuilder() {
		this.shouldBeValid = true;
	}
	
	public WarriorBuilder shouldBeFullValid(boolean should) {
		this.shouldBeValid = should;
		return this;
	}
	
	public Warrior.Builder useRandomRarityWarrior() {
		return this.useWarrior(this.getRandomRarity());
	}
	
	public Warrior.Builder useWarrior(WarriorRarity rarity) {
		Warrior.Builder builder = Warrior.warriorBuilder(rarity);
		
		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}
	
	public Warrior.Builder useCommonWarrior() {
		Warrior.Builder builder = Warrior.commonWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useUncommonWarrior() {
		Warrior.Builder builder = Warrior.uncommonWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useRareWarrior() {
		Warrior.Builder builder = Warrior.rareWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useEpicWarrior() {
		Warrior.Builder builder = Warrior.epicWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useLegendaryWarrior() {
		Warrior.Builder builder = Warrior.legendaryWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useMithicWarrior() {
		Warrior.Builder builder = Warrior.mithicWarriorBuilder();

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}
	
	private void makeItValid(Warrior.Builder builder) {
		long code = (long)(Math.random() * 10000000);
		builder.withCode(code)
			.withName("test_warrior_"+code)
			.withDescription("test_warrior_"+code+"_description")
			.withPhysicalDamage(Math.random() * 20)
			.withPhysicalArmor(Math.random() * 25)
			.withHealth(Math.random() * 100)
			.build();
	}
	
	private WarriorRarity getRandomRarity() {
		List<WarriorRarity> rarities = new ArrayList<>(List.of(WarriorRarity.values()));
	    Collections.shuffle(rarities);
	    return rarities.get(0);
	}
}
