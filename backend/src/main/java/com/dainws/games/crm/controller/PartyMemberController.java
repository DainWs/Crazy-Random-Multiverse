package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface PartyMemberController {

	@PostMapping("/party/{partyCode}/leave")
	void leaveParty(@PathVariable("partyCode") String partyCodeBase64UrlSafe);
}