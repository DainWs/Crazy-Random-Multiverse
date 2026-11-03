package com.dainws.games.crm.configuration;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;
import org.springframework.test.util.ReflectionTestUtils;

class SessionConfigurationTest {

	private static final Duration SESSION_TIMEOUT = Duration.ofHours(24);

	@Test
	void testGivenConfiguredTimeout_whenCreateSession_thenSessionExpiresAfterIt() {
		SessionConfiguration configuration = new SessionConfiguration();
		ReflectionTestUtils.setField(configuration, "timeout", SESSION_TIMEOUT);
		MapSessionRepository repository = configuration.sessionRepository();

		MapSession session = repository.createSession();

		assertThat(session.getMaxInactiveInterval()).isEqualTo(SESSION_TIMEOUT);
	}
}
