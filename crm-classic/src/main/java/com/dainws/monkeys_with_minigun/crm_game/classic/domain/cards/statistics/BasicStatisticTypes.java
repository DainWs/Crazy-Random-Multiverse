package com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.statistics;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticType;

public enum BasicStatisticTypes implements StatisticType {
	HEALTH,
	PHYSICAL_DAMAGE,
	PHYSICAL_ARMOR,
	MAGIC_DAMAGE,
	MAGIC_ARMOR,
	HEAL_PER_TURN;

	@Override
	public String getValue() {
		return this.name();
	}

}
