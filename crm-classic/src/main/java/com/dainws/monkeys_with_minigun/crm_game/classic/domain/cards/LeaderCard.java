package com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.statistics.BasicStatisticTypes;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.Statistic;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.statistics.StatisticType;

public class LeaderCard extends Card implements StatisticCard {

	private static final long serialVersionUID = -8837467851962168166L;

	private final Map<StatisticType, Statistic> statistics;

	private LeaderCard(Builder builder) {
		super(builder.name, builder.description, ClassicCardTypes.LEADER, ClassicCardRarity.NORMAL);
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
	
	public static class Builder {
		public static final Double BASE_STATISTICS_VALUE = 500D;
		
		private String name;
		private String description;
		private Map<StatisticType, Statistic> statistics = new HashMap<>();
		
		public Builder() {
			this.addStatistic(new Statistic(BasicStatisticTypes.HEALTH, BASE_STATISTICS_VALUE));
			this.addStatistic(new Statistic(BasicStatisticTypes.PHYSICAL_DAMAGE, BASE_STATISTICS_VALUE));
		}
		
		private void addStatistic(Statistic statistic) {
			this.statistics.put(statistic.getType(), statistic);
		}
		
		public Builder withName(String name) {
			this.name = name;
			return this;
		}
		
		public Builder withDescription(String description) {
			this.description = description;
			return this;
		}
		
		public Builder withBaseStatisticsValue(double baseValue) {
			this.statistics.forEach((type, statistic) -> statistic.setValue(baseValue));
			return this;
		}
		
		public LeaderCard build() {
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);			
			return new LeaderCard(this);
		}
	}
}
