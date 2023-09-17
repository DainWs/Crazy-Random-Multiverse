package com.dainws.games.cbg.domain.dealer;

import java.util.HashMap;
import java.util.Map;

import com.dainws.games.cbg.domain.card.WarriorRarity;

public class DealStrategyFactory {
	private Map<Integer, DealStrategy> dealStrategyByRound;

	public DealStrategyFactory() {
		this.dealStrategyByRound = new HashMap<>();
		this.dealStrategyByRound.put(0, new LeaderStrategy());
		this.dealStrategyByRound.put(1, new WarriorStrategy(WarriorRarity.COMMON, 2));
		this.dealStrategyByRound.put(2, new ComposedStrategy(
				new WarriorStrategy(WarriorRarity.COMMON, 1),
				new WarriorStrategy(WarriorRarity.UNCOMMON, 1)));
		this.dealStrategyByRound.put(3, new SpellStrategy());
		this.dealStrategyByRound.put(4, new WarriorStrategy(WarriorRarity.RARE, 1));
		this.dealStrategyByRound.put(5, new ComposedStrategy(
				new WarriorStrategy(WarriorRarity.RARE, 1), 
				new SpellStrategy()));
		this.dealStrategyByRound.put(6, new WarriorStrategy(WarriorRarity.EPIC, 1));
	}

	public DealStrategy createStrategy(int round) {
		if (this.dealStrategyByRound.containsKey(round)) {
			return this.dealStrategyByRound.get(round);
		}

		return new SpellStrategy();
	}
}
