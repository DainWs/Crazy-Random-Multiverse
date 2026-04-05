package com.dainws.games.crm.configuration;

import java.util.concurrent.ConcurrentHashMap;

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
	@Bean
	MapSessionRepository sessionRepository() {
		return new MapSessionRepository(new ConcurrentHashMap<>());
	}
	
	@Bean
	@SessionScope
	User webUser(HttpSession session) {
		String sessionId = session.getId();
		String username = "User-" + sessionId.substring(0, 5).toUpperCase();
		return new User(sessionId, username, UserPlatform.WEB);
	}
}
