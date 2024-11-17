package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.services.PartyService;

import jakarta.websocket.server.PathParam;

@RestController
public class WebPartyMemberController implements PartyMemberController {
	private User userSession;
	private PartyService partyService;

	public WebPartyMemberController(PartyService partyService) {
		this.partyService = partyService;
	}

	@Override
	@PostMapping("/party/{partyCode}/leave")
	public void leaveParty(@PathParam("partyCode") String partyCodeAsString) {
		PartyCode partyCode = PartyCode.from(partyCodeAsString);
		this.partyService.leaveParty(partyCode, this.userSession);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
