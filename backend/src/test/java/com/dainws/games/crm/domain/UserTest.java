package com.dainws.games.crm.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserTest {

	private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");
	private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);

	User user;

	@BeforeEach
	void beforeEach() {
		this.user = new User("user-1", "Name", UserPlatform.WEB);
	}

	@Test
	void testGivenNoSocket_whenIsConnected_thenIsFalse() {
		assertThat(this.user.isConnected()).isFalse();
	}

	@Test
	void testGivenTwoSockets_whenOneIsUnbound_thenUserIsStillConnected() {
		this.user.bindSocket("socket-1");
		this.user.bindSocket("socket-2");

		this.user.unbindSocket("socket-1", NOW);

		assertThat(this.user.isConnected()).isTrue();
	}

	@Test
	void testGivenTwoSockets_whenOneIsUnbound_thenTheOtherStaysBound() {
		this.user.bindSocket("socket-1");
		this.user.bindSocket("socket-2");

		this.user.unbindSocket("socket-1", NOW);

		assertThat(this.user.getSocketIds()).containsExactly("socket-2");
	}

	@Test
	void testGivenUserWithoutSocketLongerThanTheGracePeriod_whenCheck_thenIsTrue() {
		this.user.startWaitingForSocket(NOW);

		assertThat(this.user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, NOW.plus(GRACE_PERIOD).plusSeconds(1))).isTrue();
	}

	@Test
	void testGivenUserWithoutSocketForExactlyTheGracePeriod_whenCheck_thenIsFalse() {
		this.user.startWaitingForSocket(NOW);

		assertThat(this.user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, NOW.plus(GRACE_PERIOD))).isFalse();
	}

	@Test
	void testGivenUserWhoNeverStartedWaiting_whenCheck_thenIsFalse() {
		assertThat(this.user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, NOW.plus(GRACE_PERIOD).plusSeconds(1))).isFalse();
	}

	@Test
	void testGivenWaitingUser_whenBindSocket_thenGracePeriodIsCleared() {
		this.user.startWaitingForSocket(NOW);
		this.user.bindSocket("socket-1");
		this.user.unbindSocket("socket-1", NOW.plus(GRACE_PERIOD));

		assertThat(this.user.hasBeenWithoutSocketLongerThan(GRACE_PERIOD, NOW.plus(GRACE_PERIOD).plusSeconds(1))).isFalse();
	}

	@Test
	void testGivenUserWithSocket_whenClone_thenCopyKeepsTheSocket() {
		this.user.bindSocket("socket-1");

		User cloned = this.user.clone();

		assertThat(cloned.getSocketIds()).containsExactly("socket-1");
	}

	@Test
	void testGivenUserWithSocket_whenCloneBindsAnother_thenOriginalIsNotAffected() {
		this.user.bindSocket("socket-1");
		User cloned = this.user.clone();

		cloned.bindSocket("socket-2");

		assertThat(this.user.getSocketIds()).containsExactly("socket-1");
	}
}
