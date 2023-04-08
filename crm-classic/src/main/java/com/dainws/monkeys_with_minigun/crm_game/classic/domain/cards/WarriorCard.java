package com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.statistics.BasicStatisticTypes;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbility;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbilityCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.Statistic;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticType;

public class WarriorCard extends Card implements SpecialAbilityCard, StatisticCard {

	private static final long serialVersionUID = 4294016806000583538L;

	private SpecialAbility specialAbility;
	private Map<StatisticType, Statistic> statistics = new HashMap<>();
	
	private WarriorCard(Builder builder) {
		super(builder.name, builder.description, ClassicCardTypes.WARRIOR, builder.rarity);
		this.specialAbility = builder.specialAbility;
		this.statistics = builder.statistics;
	}

	@Override
	public void setStatistic(Statistic statistic) {
		// TODO when add new statistic launch event?
		this.statistics.put(statistic.getType(), statistic);
	}
	
	@Override
	public void removeStatistic(StatisticType type) {
		// TODO when remove statistic launch event?
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
		private ClassicCardRarity rarity = ClassicCardRarity.POP;
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
		
		public Builder asPop() {
			this.rarity = ClassicCardRarity.POP;
			return this;
		}
		
		public Builder asCommon() {
			this.rarity = ClassicCardRarity.COMMON;
			return this;
		}
		
		public Builder asRare() {
			this.rarity = ClassicCardRarity.RARE;
			return this;
		}
		
		public Builder asEpic() {
			this.rarity = ClassicCardRarity.EPIC;
			return this;
		}
		
		public Builder asLegendary() {
			this.rarity = ClassicCardRarity.LEGENDARY;
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
		
		public WarriorCard build() {
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);
			
			if (!this.statistics.containsKey(BasicStatisticTypes.HEALTH)) {
				throw new IllegalArgumentException("Not allowed Warrior creation without health.");
			}
			
			return new WarriorCard(this);
		}
	}
}
