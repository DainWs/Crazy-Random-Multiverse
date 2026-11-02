package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.dainws.games.crm.usecase.dto.UpdatePartyRequest;

public interface PartyOwnerController {

	@PutMapping("/party/{partyCode}")
	void updateParty(
		@PathVariable("partyCode") String partyCodeBase64UrlSafe,
		@RequestBody UpdatePartyRequest request
	);

	@PostMapping("/party/{partyCode}/kick/{userCode}")
	void kickoutUser(
		@PathVariable("partyCode") String partyCodeBase64UrlSafe,
		@PathVariable("userCode") String userCodeBase64UrlSafe
	);

	@PostMapping("/party/{partyCode}/start")
	void startPartyGame(@PathVariable("partyCode") String partyCodeBase64UrlSafe);
}
