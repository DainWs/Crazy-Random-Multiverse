package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.mode.GameModes;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;
import com.dainws.games.crm.usecase.dto.CreatePartyRequest;

class UserServiceTest {

	private static final int MAX_PLAYERS = 3;
	private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");
	private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);
	private static final Instant WITHIN_GRACE_PERIOD = NOW.plus(GRACE_PERIOD).minusSeconds(1);
	private static final Instant AFTER_GRACE_PERIOD = NOW.plus(GRACE_PERIOD).plusSeconds(1);

	MemoryUserRepository userRepository;
	MemoryPartyRepository partyRepository;
	UserService userService;

	@BeforeEach
	void beforeEach() {
		this.userRepository = new MemoryUserRepository();
		this.partyRepository = new MemoryPartyRepository();
		PartyService partyService = new PartyService(this.partyRepository);
		this.userService = new UserService(this.userRepository, partyService);
		this.userService.setDisconnectGracePeriod(GRACE_PERIOD);
		this.userService.setClock(this.clockAt(NOW));
	}

	@Test
	void testGivenRegisteredUser_whenExists_thenIsTrue() {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		this.userRepository.save(user);

		assertThat(this.userService.exists(user.getCode())).isTrue();
	}

	@Test
	void testGivenUserWithoutSocketBeyondTheGracePeriod_whenDeleteDisconnectedUsers_thenUserIsDeleted() {
		User user = this.saveUserWithoutSocketSince(NOW);
		this.userService.setClock(this.clockAt(AFTER_GRACE_PERIOD));

		this.userService.deleteDisconnectedUsers();

		assertThat(this.userRepository.has(user.getCode())).isFalse();
	}

	@Test
	void testGivenUserWithoutSocketWithinTheGracePeriod_whenDeleteDisconnectedUsers_thenUserIsKept() {
		User user = this.saveUserWithoutSocketSince(NOW);
		this.userService.setClock(this.clockAt(WITHIN_GRACE_PERIOD));

		this.userService.deleteDisconnectedUsers();

		assertThat(this.userRepository.has(user.getCode())).isTrue();
	}

	@Test
	void testGivenUserWithSocket_whenDeleteDisconnectedUsers_thenUserIsKept() {
		User user = this.saveUserWithoutSocketSince(NOW);
		user.bindSocket("socket-1");
		this.userService.setClock(this.clockAt(AFTER_GRACE_PERIOD));

		this.userService.deleteDisconnectedUsers();

		assertThat(this.userRepository.has(user.getCode())).isTrue();
	}

	@Test
	void testGivenNewUser_whenCreate_thenGracePeriodStartsNow() {
		User user = new User("user-1", "Name", UserPlatform.WEB);

		this.userService.create(user);

		assertThat(user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, AFTER_GRACE_PERIOD)).isTrue();
	}

	@Test
	void testGivenDisconnectedUserInParty_whenDeleteDisconnectedUsers_thenUserLeavesTheParty() {
		User user = this.saveUserWithoutSocketSince(NOW);
		Party party = new Party(user, GameModes.CLASSIC);
		this.partyRepository.save(party);
		this.userService.setClock(this.clockAt(AFTER_GRACE_PERIOD));

		this.userService.deleteDisconnectedUsers();

		assertThat(this.partyRepository.has(party.getCode())).isFalse();
	}

	@Test
	void testGivenUnknownUser_whenExists_thenIsFalse() {
		User user = new User("user-1", "Name", UserPlatform.WEB);

		assertThat(this.userService.exists(user.getCode())).isFalse();
	}

	@Test
	void testGivenCreatePartyRequest_whenCreateParty_thenPartyHasTheRequestedMaxPlayers() {
		User owner = new User("user-1", "Name", UserPlatform.WEB);
		CreatePartyRequest request = new CreatePartyRequest();
		request.setMaxUsers(MAX_PLAYERS);

		Party party = this.userService.createParty(owner, request);

		assertThat(party.getMaxUsers()).isEqualTo(MAX_PLAYERS);
	}

	private User saveUserWithoutSocketSince(Instant since) {
		User user = new User("user-1", "Name", UserPlatform.WEB);
		user.startWaitingForSocket(since);
		this.userRepository.save(user);
		return user;
	}

	private Clock clockAt(Instant instant) {
		return Clock.fixed(instant, ZoneOffset.UTC);
	}
}
