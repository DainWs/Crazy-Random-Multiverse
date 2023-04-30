package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.leaders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.LeaderCard;

@Repository
public class DefaultLeaderCardRepository implements LeaderCardRepository {
	private static final double DEFAULT_BASE_STATS_VALUE = 500D;

	private List<LeaderCard> cards = new ArrayList<>();

	public DefaultLeaderCardRepository() {
		this.initialize();
	}

	private void initialize() {
		this.cards.add(createCard("Henry Russell", "Young Entrepreneur"));
		this.cards.add(createCard("Richard Santana", "Passionate about technology"));
		this.cards.add(createCard("Angela Campbell", "Great decision making"));
		this.cards.add(createCard("Vanessa Day", "Amazing leader"));
	}

	private LeaderCard createCard(String name, String description) {
		return new LeaderCard.Builder().withName(name).withDescription(description)
				.withBaseStatisticsValue(DEFAULT_BASE_STATS_VALUE).build();
	}

	@Override
	public List<LeaderCard> provideAll() {
		return this.cards;
	}
}
