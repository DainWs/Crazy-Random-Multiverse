package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.services.GameService;

@RestController
public class WebLoadController {

	private User userSession;
	private GameService gameService;

	public WebLoadController(GameService gameService) {
		this.gameService = gameService;
	}

	@PostMapping("/game/{gameCode}/ready")
	public void readyToStart(@PathVariable("gameCode") String gameCodeBase64UrlSafe) {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);
		PlayerCode playerCode = this.userSession.getCode().toPlayerCode();
		this.gameService.loadCompleteFor(gameCode, playerCode);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
