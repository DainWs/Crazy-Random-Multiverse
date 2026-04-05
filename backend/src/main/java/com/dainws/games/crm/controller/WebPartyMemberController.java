package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.services.PartyService;

@RestController
public class WebPartyMemberController implements PartyMemberController {
	private User userSession;
	private PartyService partyService;

	public WebPartyMemberController(PartyService partyService) {
		this.partyService = partyService;
	}

	@Override
	public void leaveParty(String partyCodeBase64UrlSafe) {
		PartyCode partyCode = PartyCode.fromBase64UrlSafe(partyCodeBase64UrlSafe);
		this.partyService.leaveParty(partyCode, this.userSession.clone());
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
