package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.leaders;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.LeaderCard;

public interface LeaderCardRepository {
	List<LeaderCard> provideAll();
}
