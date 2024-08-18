package com.dainws.games.crm.domain.core.dealer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.card.WarriorRarity;

public class ClassicDealStrategyFactory implements DealStrategyFactory {
	private Map<Integer, DealStrategy> dealStrategyByRound;

	public ClassicDealStrategyFactory() {
		this.dealStrategyByRound = new HashMap<>();
		this.put(0, this.createDealStrategyForRoundZero());
		this.put(1, this.createDealStrategyForRoundOne());
		this.put(2, this.createDealStrategyForRoundTwo());
		this.put(3, this.createDealStrategyForRoundThree());
		this.put(4, this.createDealStrategyForRoundFour());
		this.put(5, this.createDealStrategyForRoundFive());
		this.put(6, this.createDealStrategyForRoundSix());
	}

	private DealStrategy createDealStrategyForRoundZero() {
		return new LeaderStrategy();
	}

	private DealStrategy createDealStrategyForRoundOne() {
		int numCardsToDeal = 2;
		return new WarriorStrategy(WarriorRarity.COMMON, numCardsToDeal);
	}

	private DealStrategy createDealStrategyForRoundTwo() {
		List<DealStrategy> dealStrategies = new ArrayList<>();
		dealStrategies.add(new WarriorStrategy(WarriorRarity.COMMON));
		dealStrategies.add(new WarriorStrategy(WarriorRarity.UNCOMMON));
		return new ComposedStrategy(dealStrategies);
	}

	private DealStrategy createDealStrategyForRoundThree() {
		return new SpellStrategy();
	}

	private DealStrategy createDealStrategyForRoundFour() {
		return new WarriorStrategy(WarriorRarity.RARE);
	}

	private DealStrategy createDealStrategyForRoundFive() {
		List<DealStrategy> dealStrategies = new ArrayList<>();
		dealStrategies.add(new WarriorStrategy(WarriorRarity.RARE));
		dealStrategies.add(new SpellStrategy());
		return new ComposedStrategy(dealStrategies);
	}

	private DealStrategy createDealStrategyForRoundSix() {
		return new WarriorStrategy(WarriorRarity.EPIC);
	}
	
	private void put(int round, DealStrategy dealStrategy) {
		this.dealStrategyByRound.put(round, dealStrategy);
	}

	@Override
	public DealStrategy createStrategy(int round) {
		if (this.dealStrategyByRound.containsKey(round)) {
			return this.dealStrategyByRound.get(round);
		}

		return new SpellStrategy();
	}
}
