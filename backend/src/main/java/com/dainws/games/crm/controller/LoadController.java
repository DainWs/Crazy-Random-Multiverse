package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public interface LoadController {

	@PostMapping("/game/{gameCode}/ready")
	void readyToStart(@PathVariable("gameCode") String gameCodeBase64UrlSafe);
}
