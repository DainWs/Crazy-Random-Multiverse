package com.dainws.games.crm.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;

class SessionConfigurationTest {

	private static final Duration SESSION_TIMEOUT = Duration.ofHours(24);

	@Test
	void testGivenConfiguredTimeout_whenCreateSession_thenSessionExpiresAfterIt() {
		MapSessionRepository repository = new SessionConfiguration().sessionRepository(SESSION_TIMEOUT);

		MapSession session = repository.createSession();

		assertThat(session.getMaxInactiveInterval()).isEqualTo(SESSION_TIMEOUT);
	}
}
