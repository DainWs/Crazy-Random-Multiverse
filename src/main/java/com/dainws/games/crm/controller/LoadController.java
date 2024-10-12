package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.domain.PartyService;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.UserService;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.translator.Translatable;

@Controller
public class LoadController {

	private UserService userService;
	private PartyService partyService;

	public LoadController(UserService userService, PartyService partyService) {
		this.userService = userService;
		this.partyService = partyService;
	}

	@MessageMapping("/game/create")
	public void createGameFromParty(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.partyService.loadGame(user);
	}
	
	@MessageMapping("/game/{gameCode}/ready")
	public void readyToStart(
			@Header("simpSessionId") String sessionId,
			@DestinationVariable(value = "gameCode") String gameCodeAsString
	) throws IllegalAccessException {
		User user = this.getUser(sessionId);
		this.partyService.markUserAsReady(GameCode.fromString(gameCodeAsString), user);
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

	private User getUser(String sessionId) throws NotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
