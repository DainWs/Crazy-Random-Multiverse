package com.dainws.games.crm.domain.core.dealer;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class RandomDealStrategyFactory implements DealStrategyFactory {
	private Map<Integer, Supplier<DealStrategy>> map;
	
	public RandomDealStrategyFactory() {
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
		int randomSupplierIndex = (int) (Math.random() * this.map.size());
		return this.map.get(randomSupplierIndex).get();
	}

	private DealStrategy createWarriorStrategy() {
		WarriorRarity[] rarities = WarriorRarity.values();
		int rarityIndex = (int) (Math.random() * rarities.length);
		int amount = (int) (Math.random() * 2) + 1;
		return new WarriorStrategy(rarities[rarityIndex], amount);
	}

	private DealStrategy createEquipmentStrategy() {
		int amount = (int) (Math.random() * 2) + 1;
		return new EquipmentStrategy(amount);
	}

	private DealStrategy createSpellStrategy() {
		int amount = (int) (Math.random() * 2) + 1;
		return new SpellStrategy(amount);
	}
}
