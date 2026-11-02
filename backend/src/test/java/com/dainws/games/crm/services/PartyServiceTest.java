package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.exception.PartyException;

class PartyServiceTest {

	@Test
	void testGivenUserWithoutParty_whenLeaveParty_thenDoesNotFail() {
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		User user = new User("user-1", "Name", UserPlatform.WEB);

		assertDoesNotThrow(() -> partyService.leaveParty(user));
	}

	@Test
	void testGivenUserWithoutParty_whenCreateParty_thenPartyIsSaved() {
		MemoryPartyRepository repository = new MemoryPartyRepository();
		PartyService partyService = new PartyService(repository);
		Party party = this.createPartyOwnedBy("user-1");

		partyService.createParty(party);

		assertThat(repository.has(party.getCode())).isTrue();
	}

	@Test
	void testGivenUserAlreadyInParty_whenCreateParty_thenFails() {
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		partyService.createParty(this.createPartyOwnedBy("user-1"));
		Party another = this.createPartyOwnedBy("user-1");

		assertThrows(PartyException.class, () -> partyService.createParty(another));
	}

	private Party createPartyOwnedBy(String userCode) {
		return new Party(new User(userCode, "Name", UserPlatform.WEB), GameModes.CLASSIC);
	}
}
