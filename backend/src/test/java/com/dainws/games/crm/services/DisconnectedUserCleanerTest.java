package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.scheduling.annotation.Scheduled;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.persistence.memory.MemoryGameRepository;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

class DisconnectedUserCleanerTest {

	private static final String CLEAN_METHOD = "deleteDisconnectedUsers";
	private static final String INTERVAL_PROPERTY =
			"${crm.user.cleanup-interval}";
	private static final Instant NOW = Instant.parse("2026-01-01T00:00:00Z");
	private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);

	@Test
	void testGivenCleaner_whenRunsPeriodically_thenIntervalComesFromTheProperty() throws NoSuchMethodException {
		Method method = DisconnectedUserCleaner.class.getMethod(CLEAN_METHOD);

		Scheduled scheduled = method.getAnnotation(Scheduled.class);

		assertThat(scheduled.fixedDelayString()).isEqualTo(INTERVAL_PROPERTY);
	}

	@Test
	void testGivenUserWithoutSocketBeyondTheGracePeriod_whenClean_thenUserIsDeleted() {
		MemoryUserRepository userRepository = new MemoryUserRepository();
		User user = new User("user-1", "Name", UserPlatform.WEB);
		user.startWaitingForSocket(NOW);
		userRepository.save(user);
		MemoryPartyRepository partyRepository = new MemoryPartyRepository();
		PartyService partyService = new PartyService(partyRepository);
		UserService userService = new UserService(userRepository, partyService);
		GameService gameService = new GameService(new GameLifeCycle(), new MemoryGameRepository(), List.of());
		gameService.setPartyRepository(partyRepository);
		userService.setGameService(gameService);
		userService.setDisconnectGracePeriod(GRACE_PERIOD);
		userService.setClock(Clock.fixed(NOW.plus(GRACE_PERIOD).plusSeconds(1), ZoneOffset.UTC));
		DisconnectedUserCleaner cleaner = new DisconnectedUserCleaner(userService);

		cleaner.deleteDisconnectedUsers();

		assertThat(userRepository.has(user.getCode())).isFalse();
	}
}
