package com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.EquipmentCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.LeaderCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.SpellCard;
import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.WarriorCard;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;

public interface CardRepository {
	List<SpellCard> provideSpells();

	List<LeaderCard> provideLeaders();

	List<WarriorCard> provideWarriors();

	List<WarriorCard> provideWarriors(CardRarity cardRarity);

	List<EquipmentCard> provideEquipments();
}
