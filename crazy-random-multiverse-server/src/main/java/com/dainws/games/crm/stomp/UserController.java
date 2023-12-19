package com.dainws.games.crm.stomp;

import java.security.Principal;
import java.util.List;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.dainws.games.crm.persistence.entity.Party;
import com.dainws.games.crm.persistence.entity.PartyCode;
import com.dainws.games.crm.persistence.entity.User;
import com.dainws.games.crm.persistence.entity.UserCode;
import com.dainws.games.crm.persistence.exceptions.PartyException;
import com.dainws.games.crm.persistence.exceptions.PartyNotFoundException;
import com.dainws.games.crm.persistence.exceptions.UserNotFoundException;
import com.dainws.games.crm.services.UserService;
import com.dainws.games.crm.stomp.dto.ModelMapper;
import com.dainws.games.crm.stomp.dto.UserInfoResponse;
import com.dainws.games.crm.stomp.dto.UserJoinPartyRequest;
import com.dainws.games.crm.stomp.dto.UserUpdateRequest;
import com.dainws.games.crm.stomp.dto.models.PartyDto;
import com.dainws.games.crm.stomp.dto.models.PartyListDto;

@Controller
public class UserController {
	private UserService userService;

	public UserController(UserService userService) {
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

		User user = new User(sessionId, username);
		this.userService.create(user);
	}

	@EventListener
	public void deleteUser(SessionDisconnectEvent disconnectEvent) throws UserNotFoundException {
		this.userService.delete(UserCode.fromString(disconnectEvent.getSessionId()));
	}

	@MessageMapping("/user/update")
	public void updateAccount(@Payload UserUpdateRequest updateRequest, @Header("simpSessionId") String sessionId)
			throws UserNotFoundException {
		User user = new User(sessionId, updateRequest.getUsername());
		this.userService.update(user);
	}

	@MessageMapping("/user/info")
	@SendToUser("/topic/user/info")
	public UserInfoResponse info(@Header("simpSessionId") String sessionId, Principal principal)
			throws UserNotFoundException {
		User user = this.getUser(sessionId);

		UserInfoResponse response = new UserInfoResponse();
		response.setSessionId(sessionId);
		response.setUsername(user.getName());
		return response;
	}

	@MessageMapping("/party/refresh")
	@SendToUser("/topic/party/list")
	public PartyListDto refreshPartyList(@Header("simpSessionId") String sessionId) {
		List<Party> parties = this.userService.getAllParties();
		return new ModelMapper().mapPartiesToPartyList(parties);
	}

	@MessageMapping("/party/info")
	@SendToUser("/topic/party/info")
	public PartyDto joinParty(@Header("simpSessionId") String sessionId) throws UserNotFoundException {
		User user = this.getUser(sessionId);
		Party party = this.userService.getPartyOfUser(user);
		return new ModelMapper().mapPartyToPartyDto(party);
	}

	// TODO adaptar al path /user
	@MessageMapping("/party/create")
	public void createParty(@Header("simpSessionId") String sessionId)
			throws UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.userService.createParty(user);
	}

	// TODO adaptar al path /user
	@MessageMapping("/party/join")
	@SendToUser("/topic/party/info")
	public void joinParty(@Payload UserJoinPartyRequest request, @Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		PartyCode partyCode = PartyCode.fromString(request.getPartyCode());
		this.userService.joinParty(partyCode, user);
	}

	// TODO adaptar al path /user
	@MessageMapping("/party/leave")
	public void leaveParty(@Header("simpSessionId") String sessionId)
			throws PartyNotFoundException, UserNotFoundException, PartyException {
		User user = this.getUser(sessionId);
		this.userService.leaveParty(user);
	}

	private User getUser(String sessionId) throws UserNotFoundException {
		return this.userService.findUser(UserCode.fromString(sessionId));
	}
}
