package com.dainws.monkeys_with_minigun.resources.cards.leaders;

import java.util.ArrayList;
import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.LeaderCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;

public class BasicLeaderProvider {

	private static BasicLeaderProvider instance;
	private static final double DEFAULT_BASE_STATS_VALUE = 500D;

	public static synchronized BasicLeaderProvider getInstance() {
		if (instance == null) {
			instance = new BasicLeaderProvider();
		}
		return instance;
	}

	private List<Card> cards = new ArrayList<>();
	
	private BasicLeaderProvider() {
		this.initialize();
	}
	
	private void initialize() {
		this.cards.add(createCard("Henry Russell", "Young Entrepreneur"));
		this.cards.add(createCard("Richard Santana", "Passionate about technology"));
		this.cards.add(createCard("Angela Campbell", "Great decision making"));
		this.cards.add(createCard("Vanessa Day", "Amazing leader"));
	}

	private LeaderCard createCard(String name, String description) {
		return new LeaderCard.Builder()
				.withName(name)
				.withDescription(description)
				.withBaseStatisticsValue(DEFAULT_BASE_STATS_VALUE)
				.build();
	}
	
	public List<Card> provide() {
		return this.cards;
	}
}
