package com.dainws.games.crm.stomp;

import java.util.List;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.entity.User;
import com.dainws.games.crm.persistence.entity.UserCode;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;
import com.dainws.games.crm.services.GameFacade;
import com.dainws.games.crm.services.UserService;
import com.dainws.games.crm.stomp.dto.ModelMapper;
import com.dainws.games.crm.stomp.dto.models.PartyListDto;

@Controller
public class GameController {
	private GameFacade gameFacade;
	private UserService userService;

	public GameController(GameFacade gameFacade, UserService userService) {
		this.gameFacade = gameFacade;
		this.userService = userService;
	}

	@MessageMapping("/party/start")
	@SendTo("/topic/party/list")
	public PartyListDto createPartyGame(@Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException {
		User user = this.getUser(sessionId);
		this.gameFacade.createGame(user);

		List<Party> parties = this.userService.getAllParties();
		return new ModelMapper().mapToPartyList(parties);
	}
	
	@MessageMapping("/game/ready")
	public void readyToStart(@Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException {
		User user = this.getUser(sessionId);
		this.gameFacade.setPlayerReady(user);
	}

	private User getUser(String sessionId) throws UserNotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
