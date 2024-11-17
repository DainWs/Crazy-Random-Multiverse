package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.models.KickoutFromPartyRequest;
import com.dainws.games.crm.controller.dto.models.UpdatePartyRequest;
import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.PartyCode;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserCode;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.services.PartyOwnerService;
import com.dainws.games.crm.services.exception.PartyException;

import jakarta.websocket.server.PathParam;


@RestController
public class WebPartyOwnerController implements PartyOwnerController {

	private User userSession;
	private PartyOwnerService partyOwnerService;

	public WebPartyOwnerController(PartyOwnerService partyService) {
		this.partyOwnerService = partyService;
	}

	@Override
	@PutMapping("/party/{partyCode}")
	public void updateParty(UpdatePartyRequest request) throws PartyException {
		PartyCode code = PartyCode.from(request.getCode());
		GameMode gameMode = request.getGameMode().getDomainGameMode();
		
		Party party = new Party(code, this.userSession, gameMode);
		party.setMaxUsers(request.getMaxPlayers());
		
		this.partyOwnerService.updateParty(this.userSession, party);
	}
	
	@Override
	@PostMapping("/party/{partyCode}/kick")
	public void kickoutUser(KickoutFromPartyRequest request) throws PartyException {
		PartyCode partyCode = PartyCode.from(request.getPartyCode());
		UserCode userToKick = UserCode.from(request.getUserCode());
		this.partyOwnerService.kickUserFromParty(this.userSession, partyCode, userToKick);
	}

	@Override
	@PostMapping("/party/{partyCode}/start")
	public void startPartyGame(@PathParam("partyCode") String partyCodeAsString) throws PartyException {
		PartyCode partyCode = PartyCode.from(partyCodeAsString);
		this.partyOwnerService.startPartyGame(this.userSession, partyCode);
	}
	
	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
