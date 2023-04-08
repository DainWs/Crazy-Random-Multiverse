package com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;

public interface CardRepository {
	List<Card> provideAllLeaders();
	List<Card> provideAllEquipments();
	List<Card> provideAllSpells();
	List<Card> provideAllWarriors(CardRarity rarity);
}
