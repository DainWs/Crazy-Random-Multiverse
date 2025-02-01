package com.dainws.games.crm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

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
	@PostMapping("/register")
	public UserDto register() {
		this.userService.create(this.userSession);

		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	@PostMapping("/login")
	public UserDto login(@RequestBody String username) {
		this.userSession.setName(username);
		this.userService.create(this.userSession);

		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	@PutMapping("/user")
	public void setAccount(@RequestBody UserDto userDto) {
		UserCode specifiedCode = UserCode.from(userDto.getId()); 
		if (this.userSession.isCode(specifiedCode)) {
			this.userSession.setName(userDto.getUsername());
			this.userService.update(this.userSession);
		}
	}

	@Override
	@GetMapping("/user")
	public UserDto getAccount() {
		UserDto userDto = new UserDto();
		userDto.setId(this.userSession.getCode().text());
		userDto.setUsername(this.userSession.getName());
		return userDto;
	}

	@Override
	@PostMapping("/party")
	public PartyDto createParty(CreatePartyRequest request) throws NotAllowedException {
		GameMode gameMode = request.getGameMode().getDomainGameMode();
		
		Party party = new Party(this.userSession, gameMode);
		party.setMaxUsers(request.getMaxPlayers());
		
		this.userService.createParty(this.userSession, party);
		return ModelMapper.toPartyDto(party);
	}
	
	@Override
	@PostMapping("/party/{partyCode}/join")
	public PartyDto joinParty(@PathVariable("partyCode") String partyCodeAsString) throws NotAllowedException {
		PartyCode partyCode = PartyCode.from(partyCodeAsString);
		Party party = this.userService.joinParty(partyCode, this.userSession);
		return ModelMapper.toPartyDto(party);
	}
	
	@Override
	@GetMapping("/party/list")
	public PartyListDto getPartyList() {
		List<Party> parties = this.userService.getParties();
		return ModelMapper.toPartyListDto(parties);
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
