package com.dainws.games.crm.stomp;

import java.util.List;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.PartyException;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;
import com.dainws.games.crm.services.PartyService;
import com.dainws.games.crm.services.UserService;
import com.dainws.games.crm.stomp.dto.ModelMapper;
import com.dainws.games.crm.stomp.dto.UserJoinPartyRequest;
import com.dainws.games.crm.stomp.dto.models.PartyListDto;

@Controller
public class PartyController {
	private UserService userService;
	private PartyService partyService;

	public PartyController(UserService userService, PartyService partyService) {
		this.userService = userService;
		this.partyService = partyService;
	}

	@MessageMapping("/party/list")
	@SendToUser("/topic/party/list")
	public PartyListDto refreshPartyList() {
		List<Party> parties = this.partyService.getAllParties();
		return new ModelMapper().mapPartiesToPartyList(parties);
	}

	@MessageMapping("/party/create")
	public void createParty(@Header("simpSessionId") String sessionId) throws UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.partyService.createParty(user);
		throw new PartyException("Esto_no_te_lo_esperabas");
	}

	@MessageMapping("/party/join")
	public void joinParty(@Payload UserJoinPartyRequest request, @Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		PartyCode partyCode = PartyCode.fromString(request.getPartyCode());
		this.partyService.joinParty(partyCode, user);
	}

	@MessageMapping("/party/leave")
	public void leaveParty(@Header("simpSessionId") String sessionId) throws UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.partyService.leaveParty(user);
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
