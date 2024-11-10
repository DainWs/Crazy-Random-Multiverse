package com.dainws.games.crm.controller;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;

@RestController
public interface PartyOwnerControllerInterface {
	@PostMapping("/party/{partyCode}/start")
	public void startPartyGame(
			@Header("simpSessionId") String sessionId, 
			@PathParam("partyCode") String partyCode);
}
