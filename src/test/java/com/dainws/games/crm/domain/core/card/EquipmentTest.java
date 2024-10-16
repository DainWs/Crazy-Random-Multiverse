package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.tools.domain.builder.CardBuilder;

public class EquipmentTest extends CardTest {
	@Override
	Card createCardWithCode(long code) {
		return Equipment.builder()
				.withCode(code)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();
	}
	
	@Override
	Card createDifferentCardTypeWithCode(long code) {
		return new CardBuilder().useSpell()
			.withCode(code)
			.withName("test_spell_"+code+"_name")
			.withDescription("test_spell_"+code+"_description")
			.withEffect(0)
			.build();
	}
}
