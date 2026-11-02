package com.dainws.games.crm.domain.core.dealer;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;
import java.util.random.RandomGenerator;

import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class RandomDealStrategyFactory implements DealStrategyFactory {
	private static final int MAX_CARDS_PER_DEAL = 2;

	private Map<Integer, Supplier<DealStrategy>> map;
	private RandomGenerator random;

	public RandomDealStrategyFactory() {
		this.random = RandomGenerator.getDefault();
		this.map = new HashMap<>();
		this.map.put(0, this::createWarriorStrategy);
		this.map.put(1, this::createSpellStrategy);
		this.map.put(2, this::createWarriorStrategy);
		this.map.put(3, this::createEquipmentStrategy);
		this.map.put(4, this::createWarriorStrategy);
		this.map.put(5, this::createSpellStrategy);
	}
	
	@Override
	public DealStrategy createStrategy(int round) {
		int randomSupplierIndex = this.random.nextInt(this.map.size());
		return this.map.get(randomSupplierIndex).get();
	}

	private DealStrategy createWarriorStrategy() {
		WarriorRarity[] rarities = WarriorRarity.values();
		int rarityIndex = this.random.nextInt(rarities.length);
		int amount = this.random.nextInt(MAX_CARDS_PER_DEAL) + 1;
		return new WarriorStrategy(rarities[rarityIndex], amount);
	}

	private DealStrategy createEquipmentStrategy() {
		int amount = this.random.nextInt(MAX_CARDS_PER_DEAL) + 1;
		return new EquipmentStrategy(amount);
	}

	private DealStrategy createSpellStrategy() {
		int amount = this.random.nextInt(MAX_CARDS_PER_DEAL) + 1;
		return new SpellStrategy(amount);
	}

	public void setRandom(RandomGenerator random) {
		this.random = random;
	}
}
