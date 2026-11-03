package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.session.MapSession;
import org.springframework.session.MapSessionRepository;

import com.dainws.games.crm.configuration.SessionConfiguration;
import com.dainws.games.crm.domain.UserCode;

class SessionUserResolverTest {

	private static final String USER_CODE = "user-1";

	MapSessionRepository sessionRepository;
	SessionUserResolver resolver;

	@BeforeEach
	void beforeEach() {
		this.sessionRepository = new MapSessionRepository(new ConcurrentHashMap<>());
		this.resolver = new SessionUserResolver(this.sessionRepository);
	}

	@Test
	void testGivenCookieOfAnExistingSession_whenResolve_thenReturnsTheUserCodeOfTheSession() {
		MapSession session = this.createSession();

		assertThat(this.resolver.resolve(this.cookieOf(session.getId())))
				.contains(UserCode.from(USER_CODE));
	}

	@Test
	void testGivenSessionCookieAmongOthers_whenResolve_thenReturnsTheUserCodeOfTheSession() {
		MapSession session = this.createSession();
		String sessionCookie = this.cookieOf(session.getId());
		String cookieHeader = "theme=dark; " + sessionCookie + "; lang=es";

		assertThat(this.resolver.resolve(cookieHeader))
				.contains(UserCode.from(USER_CODE));
	}

	@Test
	void testGivenSessionWithoutUser_whenResolve_thenReturnsEmpty() {
		MapSession session = this.sessionRepository.createSession();
		this.sessionRepository.save(session);

		assertThat(this.resolver.resolve(this.cookieOf(session.getId()))).isEmpty();
	}

	@Test
	void testGivenCookieOfUnknownSession_whenResolve_thenReturnsEmpty() {
		assertThat(this.resolver.resolve(this.cookieOf("unknown-session"))).isEmpty();
	}

	@Test
	void testGivenCookieThatIsNotBase64_whenResolve_thenReturnsEmpty() {
		assertThat(this.resolver.resolve("SESSION=%%%not-base64%%%")).isEmpty();
	}

	@Test
	void testGivenHeaderWithoutSessionCookie_whenResolve_thenReturnsEmpty() {
		assertThat(this.resolver.resolve("theme=dark")).isEmpty();
	}

	@Test
	void testGivenNoCookieHeader_whenResolve_thenReturnsEmpty() {
		assertThat(this.resolver.resolve(null)).isEmpty();
	}

	private MapSession createSession() {
		MapSession session = this.sessionRepository.createSession();
		session.setAttribute(SessionConfiguration.USER_CODE_ATTRIBUTE, USER_CODE);
		this.sessionRepository.save(session);
		return session;
	}

	private String cookieOf(String sessionId) {
		byte[] bytes = sessionId.getBytes(StandardCharsets.UTF_8);
		return "SESSION=" + Base64.getEncoder().encodeToString(bytes);
	}
}
