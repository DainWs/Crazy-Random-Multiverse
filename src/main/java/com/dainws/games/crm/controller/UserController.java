package com.dainws.games.crm.controller;

import com.dainws.games.crm.controller.dto.domain.PartyDto;
import com.dainws.games.crm.controller.dto.domain.PartyListDto;
import com.dainws.games.crm.controller.dto.domain.UserDto;
import com.dainws.games.crm.controller.dto.models.CreatePartyRequest;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;

public interface UserController {
	
	UserDto register();
	
	UserDto login(String username);
	
	UserDto getAccount();
	
	void setAccount(UserDto userDto);
	
	PartyDto createParty(CreatePartyRequest request) throws NotAllowedException;

	PartyDto joinParty(String partyCodeAsString) throws NotAllowedException;

	PartyListDto getPartyList();
}
