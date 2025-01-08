package com.dainws.games.crm.domain.builder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.Range;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class WarriorBuilder {

	private boolean shouldBeValid;
	private Range<Double> currentMultiplier;
	private Map<WarriorRarity, Range<Double>> statsRarityMultiplier;

	public WarriorBuilder() {
		this.shouldBeValid = true;
		this.currentMultiplier = Range.of(1D, 1.5D);
		this.statsRarityMultiplier = new EnumMap<>(WarriorRarity.class);
		this.statsRarityMultiplier.put(WarriorRarity.COMMON, Range.of(1D, 1.1D));
		this.statsRarityMultiplier.put(WarriorRarity.UNCOMMON, Range.of(1.1D, 1.2D));
		this.statsRarityMultiplier.put(WarriorRarity.RARE, Range.of(1.2D, 2D));
		this.statsRarityMultiplier.put(WarriorRarity.EPIC, Range.of(4D, 8D));
		this.statsRarityMultiplier.put(WarriorRarity.LEGENDARY, Range.of(10D, 20D));
		this.statsRarityMultiplier.put(WarriorRarity.MITHIC, Range.of(35D, 70D));
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
		this.currentMultiplier = this.statsRarityMultiplier.get(rarity);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useCommonWarrior() {
		Warrior.Builder builder = Warrior.commonWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.COMMON);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useUncommonWarrior() {
		Warrior.Builder builder = Warrior.uncommonWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.UNCOMMON);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useRareWarrior() {
		Warrior.Builder builder = Warrior.rareWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.RARE);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useEpicWarrior() {
		Warrior.Builder builder = Warrior.epicWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.EPIC);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useLegendaryWarrior() {
		Warrior.Builder builder = Warrior.legendaryWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.LEGENDARY);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	public Warrior.Builder useMithicWarrior() {
		Warrior.Builder builder = Warrior.mithicWarriorBuilder();
		this.currentMultiplier = this.statsRarityMultiplier.get(WarriorRarity.MITHIC);

		if (this.shouldBeValid) {
			this.makeItValid(builder);
		}
		return builder;
	}

	private void makeItValid(Warrior.Builder builder) {
		long code = (long) (Math.random() * 10000000);
		double baseStat = 1 * Range.randomBetween(this.currentMultiplier);

		builder.withCode(code)
				.withPhysicalDamage(this.toValidDouble(baseStat * 5))
				.withPhysicalArmor(this.toValidDouble(baseStat * 1))
				.withHealth(this.toValidDouble(baseStat * 1))
				.build();
	}
	
	private double toValidDouble(double value) {
		return Math.floor(Math.abs(value) * 100) / 100;
	}

	private WarriorRarity getRandomRarity() {
		List<WarriorRarity> rarities = new ArrayList<>(List.of(WarriorRarity.values()));
		Collections.shuffle(rarities);
		return rarities.get(0);
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
