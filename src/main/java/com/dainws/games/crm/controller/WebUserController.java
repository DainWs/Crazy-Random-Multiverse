package com.dainws.games.crm.controller;

import static org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor.HTTP_SESSION_ID_ATTR_NAME;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.domain.PartyDto;
import com.dainws.games.crm.controller.dto.domain.PartyListDto;
import com.dainws.games.crm.controller.dto.domain.UserDto;
import com.dainws.games.crm.controller.dto.models.CreatePartyRequest;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.services.UserService;

@RestController
public class WebUserController implements UserController {
	private User userSession;
	private UserService userService;

	public WebUserController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public UserDto register() {
		this.userService.create(this.userSession.clone());

		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	public UserDto login(String username) {
		this.userSession.setName(username);
		this.userService.create(this.userSession.clone());

		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	public void setAccount(UserDto userDto) {
		UserCode specifiedCode = UserCode.from(userDto.getId()); 
		if (this.userSession.isCode(specifiedCode)) {
			this.userSession.setName(userDto.getUsername());
			this.userService.update(this.userSession.clone());
		}
	}

	@Override
	public UserDto getAccount() {
		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	public PartyDto createParty(CreatePartyRequest request) throws NotAllowedException {
		GameMode gameMode = request.getGameMode().getDomainGameMode();
		
		Party party = new Party(this.userSession.clone(), gameMode);
		party.setMaxUsers(request.getMaxPlayers());
		
		this.userService.createParty(this.userSession.clone(), party);
		return ModelMapper.toPartyDto(party);
	}
	
	@Override
	public PartyDto joinParty(String partyCodeBase64UrlSafe) throws NotAllowedException {
		PartyCode partyCode = PartyCode.fromBase64UrlSafe(partyCodeBase64UrlSafe);
		Party party = this.userService.joinParty(partyCode, this.userSession.clone());
		return ModelMapper.toPartyDto(party);
	}
	
	@Override
	public PartyListDto getPartyList() {
		List<Party> parties = this.userService.getParties();
		return ModelMapper.toPartyListDto(parties);
	}
	
	@EventListener
	public void onSessionCreated(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		Object httpSessionId = headerAccessor.getSessionAttributes().get(HTTP_SESSION_ID_ATTR_NAME);
		UserCode userCode = UserCode.from(String.valueOf(httpSessionId));

		User user = this.userService.get(userCode);
		user.setSessionId(headerAccessor.getSessionId());
		this.userService.update(user);
	}
	
	@EventListener
	public void onSessionDestroyed(SessionDestroyedEvent event) {
		UserCode userCode = UserCode.from(event.getId());
		this.userService.delete(userCode);
	}
	
	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
