package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.RecordingUserClient;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.exception.PartyExceptionCode;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
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

	// SPEC-3
	@Test
	void testGivenSpectatorInLockedParty_whenLeaveParty_thenIsNoLongerMember() {
		LockedGame locked = this.lockPartyOfTwo();
		locked.spectator().die();

		locked.service().leaveParty(locked.party().getCode(), locked.leaver());

		assertThat(locked.party().has(locked.leaver())).isFalse();
	}

	// SPEC-3
	@Test
	void testGivenSpectatorInLockedParty_whenLeaveParty_thenStopsReceivingTheGameEvents() {
		LockedGame locked = this.lockPartyOfTwo();
		locked.spectator().die();

		locked.service().leaveParty(locked.party().getCode(), locked.leaver());

		assertThat(locked.spectator().hasLeft()).isTrue();
	}

	// SPEC-3, PARTY-6
	@Test
	void testGivenPlayerWhoIsNotSpectatorInLockedParty_whenLeaveParty_thenCodeIsPartyLocked() {
		LockedGame locked = this.lockPartyOfTwo();

		PartyException exception = assertThrows(PartyException.class,
				() -> locked.service().leaveParty(locked.party().getCode(), locked.leaver()));

		assertThat(exception.getCode()).isEqualTo(PartyExceptionCode.LOCKED);
	}

	// SPEC-3
	@Test
	void testGivenSpectatorInLockedParty_whenLeaveParty_thenTheRemainingMembersReceiveThePartyInfo() {
		LockedGame locked = this.lockPartyOfTwo();
		locked.spectator().die();

		locked.service().leaveParty(locked.party().getCode(), locked.leaver());

		assertThat(locked.userClient().getRecipients()).containsExactly(locked.party().getOwner());
	}

	private LockedGame lockPartyOfTwo() {
		MemoryPartyRepository partyRepository = new MemoryPartyRepository();
		MemoryGameRepository gameRepository = new MemoryGameRepository();
		PartyService partyService = new PartyService(partyRepository);
		partyService.setGameRepository(gameRepository);
		partyService.setUserClient(new RecordingUserClient());

		Party party = this.createPartyOwnedBy("owner");
		User leaver = new User("leaver", "Name", UserPlatform.WEB);
		partyService.createParty(party);
		partyService.joinParty(party.getCode(), leaver);
		RecordingUserClient userClient = new RecordingUserClient();
		partyService.setUserClient(userClient);

		UserPlayer ownerPlayer = new UserPlayer(party.getOwner());
		UserPlayer spectator = new UserPlayer(leaver);
		Game game = new GameBuilder().withPlayers(ownerPlayer, spectator).build();
		gameRepository.save(game);
		party.setCurrentGame(game.getCode());

		return new LockedGame(partyService, party, leaver, spectator, userClient);
	}

	private Party createPartyOwnedBy(String userCode) {
		return new Party(new User(userCode, "Name", UserPlatform.WEB), GameModes.CLASSIC);
	}
}
