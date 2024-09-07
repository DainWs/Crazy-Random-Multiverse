package com.dainws.games.crm.controller;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.dainws.games.crm.controller.dto.models.UserDto;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.UserPlatform;
import com.dainws.games.crm.domain.exception.UserNotFoundException;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.services.UserService;

@Controller
public class WebUserController {
	private UserService userService;

	public WebUserController(UserService userService) {
		this.userService = userService;
	}

	@EventListener
	public void onUserConnect(SessionConnectEvent connectEvent) {
		StompHeaderAccessor headers = StompHeaderAccessor.wrap(connectEvent.getMessage());

		String sessionId = headers.getSessionId();
		String username = "User-" + sessionId.substring(0, 5).toUpperCase();
		if (headers.containsNativeHeader("username")) {
			username = headers.getFirstNativeHeader("username");
		}

		User user = new User(sessionId, username, UserPlatform.WEB);
		this.userService.create(user);
	}

	@EventListener
	public void deleteUser(SessionDisconnectEvent disconnectEvent) {
		UserCode userCode = UserCode.fromString(disconnectEvent.getSessionId());
		this.userService.delete(userCode);
	}

	@MessageMapping("/user/update")
	public void updateAccount(@Payload UserDto userDto, @Header("simpSessionId") String sessionId)
			throws UserNotFoundException {
		User user = new User(sessionId, userDto.getUsername(), UserPlatform.WEB);
		this.userService.update(user);
	}

	@MessageMapping("/user/info")
	@SendToUser("/topic/user/info")
	public UserDto info(@Header("simpSessionId") String sessionId) throws UserNotFoundException {
		User user = this.getUser(sessionId);
		UserDto userDto = new UserDto();
		userDto.setUid(sessionId);
		userDto.setUsername(user.getName());
		return userDto;
	}

	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		if (exception instanceof Translatable) {
			return ((Translatable) exception).getKey().getValue();
		}

		return exception.getMessage();
	}

	private User getUser(String sessionId) throws UserNotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
