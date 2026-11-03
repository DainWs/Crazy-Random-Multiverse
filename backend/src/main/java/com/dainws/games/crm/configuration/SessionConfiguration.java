package com.dainws.games.crm.configuration;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;
import org.springframework.web.context.annotation.SessionScope;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlatform;

import jakarta.servlet.http.HttpSession;

@Configuration
@EnableSpringHttpSession
public class SessionConfiguration {
	public static final String USER_CODE_ATTRIBUTE = "userCode";

	private static final int DEFAULT_NAME_SUFFIX_LENGTH = 5;

	@Value("${spring.session.timeout}")
	private Duration timeout;

	@Bean
	MapSessionRepository sessionRepository() {
		MapSessionRepository repository = new MapSessionRepository(new ConcurrentHashMap<>());
		repository.setDefaultMaxInactiveInterval(this.timeout);
		return repository;
	}

	@Bean
	@SessionScope
	User webUser(HttpSession session) {
		String userCode = UUID.randomUUID().toString();
		String username = "User-" + userCode.substring(0, DEFAULT_NAME_SUFFIX_LENGTH).toUpperCase();
		session.setAttribute(USER_CODE_ATTRIBUTE, userCode);
		return new User(userCode, username, UserPlatform.WEB);
	}
}
