package com.dainws.games.crm.controller.events;

import static org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor.HTTP_SESSION_ID_ATTR_NAME;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.services.UserService;

@Component
@ConditionalOnProperty(value = "crm.communication.websocket.enabled", havingValue = "true")
public class WebSocketConnectionManager {

	private UserService userService;

	public WebSocketConnectionManager(UserService userService) {
		this.userService = userService;
	}

	@EventListener
	public void onSessionCreated(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		Object httpSessionId = headerAccessor.getSessionAttributes().get(HTTP_SESSION_ID_ATTR_NAME);
		UserCode userCode = UserCode.from(String.valueOf(httpSessionId));

		User user = this.userService.get(userCode);
		user.setSessionId(headerAccessor.getSessionId());
		this.userService.update(user);
	}

	@EventListener
	public void onSessionDestroyed(SessionDestroyedEvent event) {
		UserCode userCode = UserCode.from(event.getId());
		this.userService.delete(userCode);
	}
}
