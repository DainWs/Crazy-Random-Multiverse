package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.services.PartyOwnerService;
import com.dainws.games.crm.services.exception.PartyException;
import com.dainws.games.crm.usecase.dto.UpdatePartyRequest;


@RestController
public class WebPartyOwnerController implements PartyOwnerController {

	private User userSession;
	private PartyOwnerService partyOwnerService;

	public WebPartyOwnerController(PartyOwnerService partyService) {
		this.partyOwnerService = partyService;
	}

	@Override
	public void updateParty(UpdatePartyRequest request) throws PartyException {
		this.partyOwnerService.updateParty(this.userSession.clone(), request);
	}

	@Override
	public void kickoutUser(String partyCodeB64UrlSafe, String userCodeB64UrlSafe) throws PartyException {
		PartyCode partyCode = PartyCode.fromBase64UrlSafe(partyCodeB64UrlSafe);
		UserCode userToKick = UserCode.fromBase64UrlSafe(userCodeB64UrlSafe);
		this.partyOwnerService.kickUserFromParty(this.userSession.clone(), partyCode, userToKick);
	}

	@Override
	public void startPartyGame(String partyCodeBase64UrlSafe) throws PartyException {
		PartyCode partyCode = PartyCode.fromBase64UrlSafe(partyCodeBase64UrlSafe);
		this.partyOwnerService.startPartyGame(this.userSession.clone(), partyCode);
	}
	
	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
