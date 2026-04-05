package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.usecase.PlayerUsecase;
import com.dainws.games.crm.usecase.dto.ActionDto;

@RestController
public class WebPlayerController implements PlayerController {

	private User userSession;

	private PlayerUsecase playerUsecase;

	public WebPlayerController(PlayerUsecase playerUsecase) {
		this.playerUsecase = playerUsecase;
	}

	@Override
	public void dispatchAction(String gameCodeBase64UrlSafe, ActionDto actionDto) throws IllegalAccessException {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);

		this.playerUsecase.performAction(gameCode, this.userSession.clone(), actionDto);
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
