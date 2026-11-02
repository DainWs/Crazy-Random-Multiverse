package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.services.GameService;

@RestController
public class WebLoadController implements LoadController {

	private User userSession;
	private GameService gameService;

	public WebLoadController(GameService gameService) {
		this.gameService = gameService;
	}

	@Override
	public void readyToStart(String gameCodeBase64UrlSafe) {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);
		PlayerCode playerCode = this.userSession.getCode().toPlayerCode();
		this.gameService.loadCompleteFor(gameCode, playerCode);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
