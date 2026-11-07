package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.RecordingUserClient;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.services.exception.PartyException;

class PartyServiceTest {

	@Test
	void testGivenUserWithoutParty_whenLeaveDeletedUser_thenDoesNotFail() {
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		User user = new User("user-1", "Name", UserPlatform.WEB);

		assertDoesNotThrow(() -> partyService.leaveDeletedUser(user));
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

	@Test
	void testGivenPartyWithOwner_whenUserJoinsParty_thenEveryMemberReceivesThePartyInfo() {
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		RecordingUserClient userClient = new RecordingUserClient();
		partyService.setUserClient(userClient);
		Party party = this.createPartyOwnedBy("owner");
		partyService.createParty(party);
		User joiner = new User("joiner", "Name", UserPlatform.WEB);

		partyService.joinParty(party.getCode(), joiner);

		assertThat(userClient.getRecipients()).containsExactlyInAnyOrder(party.getOwner(), joiner);
	}

	private Party createPartyOwnedBy(String userCode) {
		return new Party(new User(userCode, "Name", UserPlatform.WEB), GameModes.CLASSIC);
	}
}
