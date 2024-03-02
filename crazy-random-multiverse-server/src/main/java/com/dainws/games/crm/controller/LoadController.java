package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.domain.model.UserCode;
import com.dainws.games.crm.exception.UserNotFoundException;
import com.dainws.games.crm.services.LoadService;
import com.dainws.games.crm.services.UserService;

@Controller
public class LoadController {
	private LoadService loadService;
	private UserService userService;

	public LoadController(LoadService loadService, UserService userService) {
		this.loadService = loadService;
		this.userService = userService;
	}

	@MessageMapping("/game/create")
	public void createGameFromParty(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.loadService.loadGameOfPartyOwner(user);
	}
	
	@MessageMapping("/game/ready")
	public void readyToStart(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.loadService.setUserReady(user);
	}
	
	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		if (exception instanceof Translatable) {
			return ((Translatable)exception).getKey().getValue();
		}

		exception.printStackTrace();
		return exception.getMessage();
	}

	private User getUser(String sessionId) throws UserNotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}