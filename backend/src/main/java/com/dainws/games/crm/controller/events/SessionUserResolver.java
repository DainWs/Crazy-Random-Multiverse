package com.dainws.games.crm.controller.events;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.session.MapSessionRepository;
import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.UserCode;

import io.netty.handler.codec.http.cookie.Cookie;
import io.netty.handler.codec.http.cookie.ServerCookieDecoder;

@Component
@ConditionalOnProperty(value = "crm.communication.socket-io.enabled", havingValue = "true", matchIfMissing = true)
public class SessionUserResolver {
	private static final String SESSION_COOKIE_NAME = "SESSION";

	private MapSessionRepository sessionRepository;
	private Logger logger;

	public SessionUserResolver(MapSessionRepository sessionRepository) {
		this.sessionRepository = sessionRepository;
		this.logger = LoggerFactory.getLogger(getClass());
	}

	public Optional<UserCode> resolve(String cookieHeader) {
		if (cookieHeader == null) {
			return Optional.empty();
		}

		return ServerCookieDecoder.LAX.decode(cookieHeader).stream() //
				.filter(cookie -> SESSION_COOKIE_NAME.equals(cookie.name())) //
				.map(Cookie::value) //
				.findFirst() //
				.flatMap(this::decodeSessionId) //
				.filter(this::existsSession) //
				.map(UserCode::from);
	}

	private Optional<String> decodeSessionId(String cookieValue) {
		try {
			byte[] bytes = Base64.getDecoder().decode(cookieValue);
			return Optional.of(new String(bytes, StandardCharsets.UTF_8));
		} catch (IllegalArgumentException exception) {
			// Ignored on purpose: a malformed cookie means the request has no session
			this.logger.debug("The session cookie is not valid Base64");
			return Optional.empty();
		}
	}

	private boolean existsSession(String sessionId) {
		return this.sessionRepository.findById(sessionId) != null;
	}
}
