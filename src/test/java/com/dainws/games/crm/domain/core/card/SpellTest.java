package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.tools.domain.builder.CardBuilder;

public class SpellTest extends CardTest {

	@Override
	Card createCardWithCode(long code) {
		return Spell.newIntance(code, 0l);
	}
	
	@Override
	Card createDifferentCardTypeWithCode(long code) {
		return new CardBuilder().useEquipment()
				.withCode(code)
				.build();
	}
}
