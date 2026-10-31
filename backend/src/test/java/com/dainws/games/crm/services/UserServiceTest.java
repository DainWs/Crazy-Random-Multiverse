package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

class UserServiceTest {

	MemoryUserRepository userRepository;
	MemoryPartyRepository partyRepository;
	UserService userService;

	@BeforeEach
	void beforeEach() {
		this.userRepository = new MemoryUserRepository();
		this.partyRepository = new MemoryPartyRepository();
		PartyService partyService = new PartyService(this.partyRepository);
		this.userService = new UserService(this.userRepository, partyService);
	}

	@Test
	void testGivenRegisteredUser_whenExists_thenIsTrue() {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		this.userRepository.save(user);

		assertThat(this.userService.exists(user.getCode())).isTrue();
	}

	@Test
	void testGivenUserWithoutSocket_whenDeleteDisconnectedUsers_thenUserIsDeleted() {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		this.userRepository.save(user);

		this.userService.deleteDisconnectedUsers();

		assertThat(this.userRepository.has(user.getCode())).isFalse();
	}

	@Test
	void testGivenUserWithSocket_whenDeleteDisconnectedUsers_thenUserIsKept() {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		user.setSessionId("socket-1");
		this.userRepository.save(user);

		this.userService.deleteDisconnectedUsers();

		assertThat(this.userRepository.has(user.getCode())).isTrue();
	}

	@Test
	void testGivenDisconnectedUserInParty_whenDeleteDisconnectedUsers_thenUserLeavesTheParty() {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		this.userRepository.save(user);
		Party party = new Party(user, GameModes.CLASSIC);
		this.partyRepository.save(party);

		this.userService.deleteDisconnectedUsers();

		assertThat(this.partyRepository.has(party.getCode())).isFalse();
	}

	@Test
	void testGivenUnknownUser_whenExists_thenIsFalse() {
		User user = new User("user-1", "Name", UserPlatform.WEB);

		assertThat(this.userService.exists(user.getCode())).isFalse();
	}
}
