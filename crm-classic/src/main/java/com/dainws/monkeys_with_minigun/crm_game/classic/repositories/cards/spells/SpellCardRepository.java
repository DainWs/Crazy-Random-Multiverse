package com.dainws.monkeys_with_minigun.crm_game.classic.repositories.cards.spells;

import java.util.List;

import com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards.SpellCard;

public interface SpellCardRepository {
	List<SpellCard> provideAll();
}
