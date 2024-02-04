package com.dainws.games.crm.stomp;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.domain.model.PartyCode;
import com.dainws.games.crm.domain.model.User;
import com.dainws.games.crm.domain.model.UserCode;
import com.dainws.games.crm.exception.PartyException;
import com.dainws.games.crm.exception.PartyNotFoundException;
import com.dainws.games.crm.exception.UserNotFoundException;
import com.dainws.games.crm.services.PartyFacade;
import com.dainws.games.crm.services.UserService;
import com.dainws.games.crm.stomp.dto.UserJoinPartyRequest;

@Controller
public class PartyController {
	private UserService userService;
	private PartyFacade partyFacade;

	public PartyController(UserService userService, PartyFacade partyFacade) {
		this.userService = userService;
		this.partyFacade = partyFacade;
	}

	@MessageMapping("/party/list")
	public void refreshPartyList(@Header("simpSessionId") String sessionId) {
		User user = this.getUser(sessionId);
		this.partyFacade.updatePartyListOf(user);
	}

	@MessageMapping("/party/create")
	public void createParty(@Header("simpSessionId") String sessionId) throws UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.partyFacade.createParty(user);
	}

	@MessageMapping("/party/join")
	public void joinParty(@Payload UserJoinPartyRequest request, @Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		PartyCode partyCode = PartyCode.fromString(request.getPartyCode());
		this.partyFacade.joinParty(partyCode, user);
	}

	@MessageMapping("/party/leave")
	public void leaveParty(@Header("simpSessionId") String sessionId) throws UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.partyFacade.leaveParty(user);
	}
	
	@MessageExceptionHandler
	@SendToUser("/topic/error")
	public String handleException(Throwable exception) {
		if (exception instanceof Translatable) {
			return ((Translatable)exception).getKey().getValue();
		}

		return exception.getMessage();
	}
	
	private User getUser(String sessionId) throws UserNotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
