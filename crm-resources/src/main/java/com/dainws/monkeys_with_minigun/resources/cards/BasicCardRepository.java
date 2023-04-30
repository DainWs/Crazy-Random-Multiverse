package com.dainws.monkeys_with_minigun.resources.cards;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.ports.CardRepository;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.CardRarity;

public class BasicCardRepository implements CardRepository {
	@Override
	public List<Card> provideAllLeaders() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Card> provideAllEquipments() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Card> provideAllSpells() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Card> provideAllWarriors(CardRarity rarity) {
		// TODO Auto-generated method stub
		return null;
	}

}
