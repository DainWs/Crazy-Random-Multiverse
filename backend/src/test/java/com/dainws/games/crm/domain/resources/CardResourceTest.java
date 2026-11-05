package com.dainws.games.crm.domain.resources;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.WarriorRarity;

class CardResourceTest {

	@Test
	void testGivenLeader_whenGetKey_thenItIsLeaderAndCode() {
		CardResource card = new CardResource(new CardCode(0, CardType.LEADER));

		assertEquals("leader.0", card.getKey());
	}

	@Test
	void testGivenWarrior_whenGetKey_thenItIncludesTheRarity() {
		CardResource card = new CardResource(new CardCode(4, CardType.WARRIOR));
		card.setRarity(WarriorRarity.RARE);

		assertEquals("warrior.rare.4", card.getKey());
	}

	@Test
	void testGivenEquipment_whenGetKey_thenItIsEquipmentAndCode() {
		CardResource card = new CardResource(new CardCode(1, CardType.EQUIPMENT));

		assertEquals("equipment.1", card.getKey());
	}

	@Test
	void testGivenSpell_whenHasKey_thenItIsFalse() {
		CardResource card = new CardResource(new CardCode(0, CardType.SPELL));

		assertFalse(card.hasKey());
	}

	@Test
	void testGivenSpell_whenGetKey_thenThrowIllegalState() {
		CardResource card = new CardResource(new CardCode(0, CardType.SPELL));

		assertThrows(IllegalStateException.class, card::getKey);
	}
}
