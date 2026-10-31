package com.dainws.games.crm.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;
import org.springframework.scheduling.annotation.Scheduled;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.persistence.memory.MemoryPartyRepository;
import com.dainws.games.crm.persistence.memory.MemoryUserRepository;

class DisconnectedUserCleanerTest {

	private static final String CLEAN_METHOD = "deleteDisconnectedUsers";
	private static final String INTERVAL_PROPERTY =
			"${crm.user.cleanup-interval}";

	@Test
	void testGivenCleaner_whenRunsPeriodically_thenIntervalComesFromTheProperty() throws NoSuchMethodException {
		Method method = DisconnectedUserCleaner.class.getMethod(CLEAN_METHOD);

		Scheduled scheduled = method.getAnnotation(Scheduled.class);

		assertThat(scheduled.fixedDelayString()).isEqualTo(INTERVAL_PROPERTY);
	}

	@Test
	void testGivenUserWithoutSocket_whenClean_thenUserIsDeleted() {
		MemoryUserRepository userRepository = new MemoryUserRepository();
		User user = new User("user-1", "Name", UserPlatform.WEB);
		userRepository.save(user);
		PartyService partyService = new PartyService(new MemoryPartyRepository());
		UserService userService = new UserService(userRepository, partyService);
		DisconnectedUserCleaner cleaner = new DisconnectedUserCleaner(userService);

		cleaner.deleteDisconnectedUsers();

		assertThat(userRepository.has(user.getCode())).isFalse();
	}
}
