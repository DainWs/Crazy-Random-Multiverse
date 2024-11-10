package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.PartyService;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.exception.NotFoundException;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.services.PartyOwnerService;
import com.dainws.games.crm.services.UserService;

import jakarta.websocket.server.PathParam;

@Controller
public class PartyOwnerController implements PartyOwnerControllerInterface {

	private UserService userService;
	private PartyOwnerService partyOwnerService;

	public PartyOwnerController(UserService userService, PartyOwnerService partyService) {
		this.userService = userService;
		this.partyOwnerService = partyService;
	}

	@Override
	public void startPartyGame(String sessionId, String partyCodeAsString) {
		User user = this.getUser(sessionId);
		PartyCode partyCode = PartyCode.fromString(partyCodeAsString);
		this.partyOwnerService.startPartyGame(user, partyCode);
	}
	
	@MessageMapping("/game/{gameCode}/ready")
	public void readyToStart(
			@Header("simpSessionId") String sessionId,
			@DestinationVariable(value = "gameCode") String gameCodeAsString
	) throws IllegalAccessException {
		User user = this.getUser(sessionId);
		this.partyOwnerService.markUserAsReady(GameCode.fromString(gameCodeAsString), user);
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
