package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.equipment;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.EquipmentCard;

public interface EquipmentCardRepository {
	List<EquipmentCard> provideAll();
}
