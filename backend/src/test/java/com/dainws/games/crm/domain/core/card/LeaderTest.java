package com.dainws.games.crm.domain.core.card;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;

class LeaderTest {

	@Test
	void testGivenPlacedLeader_whenCanAttack_thenReturnTrue() {
		Leader leader = CardBuilder.buildLeader();

		leader.startPlacementCooldown();

		assertTrue(leader.canAttack());
	}
}
