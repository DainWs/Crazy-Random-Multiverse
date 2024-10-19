package com.dainws.games.crm.domain.core.card;

public class EquipmentTest extends CardTest {
	@Override
	Card createCardWithCode(long code) {
		return Equipment.builder()
				.withCode(code)
				.build();
	}
	
	@Override
	Card createDifferentCardTypeWithCode(long code) {
		return Spell.newIntance(code, 0l);
	}
}
