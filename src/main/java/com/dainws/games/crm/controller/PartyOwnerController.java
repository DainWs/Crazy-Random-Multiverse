package com.dainws.games.crm.controller;

import com.dainws.games.crm.controller.dto.models.KickoutFromPartyRequest;
import com.dainws.games.crm.controller.dto.models.UpdatePartyRequest;

public interface PartyOwnerController {

	void updateParty(UpdatePartyRequest request);
	
	void kickoutUser(KickoutFromPartyRequest request);

	void startPartyGame(String partyCodeAsString);
}
