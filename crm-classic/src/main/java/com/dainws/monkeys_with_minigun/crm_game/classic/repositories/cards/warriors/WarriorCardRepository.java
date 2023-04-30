package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.warriors;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.WarriorCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;

public interface WarriorCardRepository {
	List<WarriorCard> provideAll();

	List<WarriorCard> provideAll(CardRarity rarity);
}
