package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.domain.builder.CardBuilder;

public class SpellTest extends CardTest {

	@Override
	Card createCardWithCode(long code) {
		return new CardBuilder().useSpell()
				.withCode(code)
				.withName("test_spell_"+code+"_name")
				.withDescription("test_spell_"+code+"_description")
				.withEffect(0)
				.build();
	}
	
	@Override
	Card createDifferentCardTypeWithCode(long code) {
		return new CardBuilder().useEquipment()
				.withCode(code)
				.withName("test_equipment_"+code+"_name")
				.withDescription("test_equipment_"+code+"_description")
				.build();
	}
}
