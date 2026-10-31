package com.dainws.games.crm.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;

class PartyServiceTest {

	@Test
	void testGivenUserWithoutParty_whenLeaveParty_thenDoesNotFail() {
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		User user = new User("user-1", "Name", UserPlatform.WEB);

		assertDoesNotThrow(() -> partyService.leaveParty(user));
	}
}
