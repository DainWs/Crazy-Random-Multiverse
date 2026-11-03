package com.dainws.games.crm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.response.PartyDto;
import com.dainws.games.crm.controller.dto.response.PartyListDto;
import com.dainws.games.crm.controller.dto.response.UserDto;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.services.UserService;
import com.dainws.games.crm.usecase.dto.CreatePartyRequest;

@RestController
public class WebUserController implements UserController {
	private User userSession;
	private UserService userService;

	public WebUserController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public UserDto register() {
		if (!this.userService.exists(this.userSession.getCode())) {
			this.userService.create(this.userSession.clone());
		}

		return ModelMapper.toUserDto(this.userService.get(this.userSession.getCode()));
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
		return ModelMapper.toUserDto(this.userService.get(this.userSession.getCode()));
	}

	@Override
	public PartyDto createParty(CreatePartyRequest request) throws NotAllowedException {
		Party party = this.userService.createParty(this.userSession.clone(), request);

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
	
	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
