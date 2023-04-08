package com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbility;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbilityCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.Statistic;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticType;

public class EquipmentCard extends Card implements SpecialAbilityCard, StatisticCard {

	private static final long serialVersionUID = 2664829022403404993L;

	private SpecialAbility specialAbility;
	private Map<StatisticType, Statistic> statistics = new HashMap<>();

	private EquipmentCard(Builder builder) {
		super(builder.name, builder.description, ClassicCardTypes.EQUIPMENT, ClassicCardRarity.NORMAL);
		this.specialAbility = builder.specialAbility;
		this.statistics = builder.statistics;
	}

	@Override
	public void setStatistic(Statistic statistic) {
		this.statistics.put(statistic.getType(), statistic);
	}

	@Override
	public void removeStatistic(StatisticType type) {
		this.statistics.remove(type);
	}

	@Override
	public boolean hasStatistic(StatisticType type) {
		return this.statistics.containsKey(type);
	}

	@Override
	public Optional<Statistic> getStatistic(StatisticType type) {
		return Optional.ofNullable(this.statistics.getOrDefault(type, null));
	}

	@Override
	public boolean hasSpecialAbility() {
		return this.specialAbility != null;
	}

	@Override
	public Optional<SpecialAbility> getSpecialAbility() {
		return Optional.ofNullable(this.specialAbility);
	}

	public static class Builder {
		private String name;
		private String description;
		private SpecialAbility specialAbility;
		private Map<StatisticType, Statistic> statistics = new HashMap<>();

		public Builder withName(String name) {
			this.name = name;
			return this;
		}

		public Builder withDescription(String description) {
			this.description = description;
			return this;
		}

		public Builder withSpecialAbility(SpecialAbility specialAbility) {
			this.specialAbility = specialAbility;
			return this;
		}

		public Builder addStatistic(Statistic statistic) {
			this.statistics.put(statistic.getType(), statistic);
			return this;
		}

		public Builder removeStatistic(Statistic statistic) {
			this.statistics.remove(statistic.getType());
			return this;
		}
		
		public Builder removeAllStatistics() {
			this.statistics.clear();
			return this;
		}

		public EquipmentCard build() {
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);
			return new EquipmentCard(this);
		}
	}
}
