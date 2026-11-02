package com.dainws.games.crm.domain.core.dealer;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.random.RandomGenerator;

import org.junit.jupiter.api.Test;

class RandomDealStrategyFactoryTest {

	private static final int WARRIOR_INDEX = 0;
	private static final int SPELL_INDEX = 1;
	private static final int EQUIPMENT_INDEX = 3;
	private static final int ANY_ROUND = 0;

	@Test
	void testGivenRandomPicksWarriorIndex_whenCreateStrategy_thenWarriorStrategyIsCreated() {
		RandomDealStrategyFactory factory = this.factoryPicking(WARRIOR_INDEX);

		assertThat(factory.createStrategy(ANY_ROUND)).isInstanceOf(WarriorStrategy.class);
	}

	@Test
	void testGivenRandomPicksSpellIndex_whenCreateStrategy_thenSpellStrategyIsCreated() {
		RandomDealStrategyFactory factory = this.factoryPicking(SPELL_INDEX);

		assertThat(factory.createStrategy(ANY_ROUND)).isInstanceOf(SpellStrategy.class);
	}

	@Test
	void testGivenRandomPicksEquipmentIndex_whenCreateStrategy_thenEquipmentStrategyIsCreated() {
		RandomDealStrategyFactory factory = this.factoryPicking(EQUIPMENT_INDEX);

		assertThat(factory.createStrategy(ANY_ROUND)).isInstanceOf(EquipmentStrategy.class);
	}

	// Clamped so the other draws (rarity, amount) stay within their bounds.
	private RandomDealStrategyFactory factoryPicking(int value) {
		RandomDealStrategyFactory factory = new RandomDealStrategyFactory();
		factory.setRandom(new RandomGenerator() {
			@Override
			public long nextLong() {
				return value;
			}

			@Override
			public int nextInt(int bound) {
				return Math.min(value, bound - 1);
			}
		});
		return factory;
	}
}
