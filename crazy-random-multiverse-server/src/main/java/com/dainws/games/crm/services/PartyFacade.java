package com.dainws.games.crm.services;

import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.model.PartyCode;
import com.dainws.games.crm.domain.model.User;


// TODO clase inutil?
@Component
public class PartyFacade {
	private PartyService partyService;

	public PartyFacade(PartyService partyService) {
		this.partyService = partyService;
	}

	public void createParty(User partyOwner) {
		this.partyService.createParty(partyOwner);
	}

	public void joinParty(PartyCode partyCode, User user) {
		this.partyService.joinParty(partyCode, user);
	}

	public void leaveParty(User user) {
		this.partyService.leaveParty(user);
	}

	public void updatePartyListOf(User user) {
		this.partyService.updatePartyListOf(user);
	}
}
