package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.dainws.games.crm.controller.dto.domain.PartyDto;
import com.dainws.games.crm.controller.dto.domain.PartyListDto;
import com.dainws.games.crm.controller.dto.domain.UserDto;
import com.dainws.games.crm.controller.dto.models.CreatePartyRequest;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;

public interface UserController {

	@PostMapping("/register")
	UserDto register();

	@PostMapping("/login")
	UserDto login(@RequestBody String username);

	@GetMapping("/user")
	UserDto getAccount();

	@PutMapping("/user")
	void setAccount(@RequestBody UserDto userDto);

	@PostMapping("/party")
	PartyDto createParty(@RequestBody CreatePartyRequest request) throws NotAllowedException;

	@PostMapping("/party/{partyCode}/join")
	PartyDto joinParty(@PathVariable("partyCode") String partyCodeAsString) throws NotAllowedException;

	@GetMapping("/party/list")
	PartyListDto getPartyList();
}
