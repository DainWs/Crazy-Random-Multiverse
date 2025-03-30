package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.dainws.games.crm.controller.dto.models.KickoutFromPartyRequest;
import com.dainws.games.crm.controller.dto.models.UpdatePartyRequest;

public interface PartyOwnerController {

	@PutMapping("/party/{partyCode}")
	void updateParty(@RequestBody UpdatePartyRequest request);

	@PostMapping("/party/{partyCode}/kick")
	void kickoutUser(@RequestBody KickoutFromPartyRequest request);

	@PostMapping("/party/{partyCode}/start")
	void startPartyGame(@PathVariable("partyCode") String partyCodeBase64UrlSafe);
}
