package com.dainws.games.crm.stomp;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;
import com.dainws.games.crm.services.GameFacade;
import com.dainws.games.crm.services.UserService;

@Controller
public class GameController {
	private GameFacade gameFacade;
	private UserService userService;

	public GameController(GameFacade gameFacade, UserService userService) {
		this.gameFacade = gameFacade;
		this.userService = userService;
	}

	@MessageMapping("/game/create")
	public void createPartyGame(@Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException {
		User user = this.getUser(sessionId);
		this.gameFacade.createGame(user);
	}
	
	@MessageMapping("/game/ready")
	public void readyToStart(@Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException {
		User user = this.getUser(sessionId);
		this.gameFacade.setPlayerReady(user);
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
