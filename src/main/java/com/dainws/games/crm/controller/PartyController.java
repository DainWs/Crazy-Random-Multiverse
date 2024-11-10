package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.services.PartyService;
import com.dainws.games.crm.services.UserService;

@Controller
public class PartyController {
	private UserService userService;
	private PartyService partyService;

	public PartyController(UserService userService, PartyService partyService) {
		this.userService = userService;
		this.partyService = partyService;
	}

	@MessageMapping("/party/list")
	public void refreshPartyList(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.partyService.updatePartyListOf(user);
	}

	@MessageMapping("/party/create")
	public void createParty(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.partyService.createParty(user);
	}

	@MessageMapping("/party/join/{partyCode}")
	public void joinParty(
			@DestinationVariable(value = "partyCode") String partyCode,
			@Header("simpSessionId") String sessionId
	) {
		User user = this.getUser(sessionId);
		this.partyService.joinParty(PartyCode.fromString(partyCode), user);
	}

	@MessageMapping("/party/leave")
	public void leaveParty(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.partyService.leaveParty(user);
	}

	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		exception.printStackTrace();
		if (exception instanceof Translatable) {
			return ((Translatable) exception).getKey().getValue();
		}

		return exception.getMessage();
	}

	private User getUser(String sessionId) {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
