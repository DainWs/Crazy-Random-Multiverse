package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.response.ResourceManifestDto;
import com.dainws.games.crm.domain.resources.Manifest;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.services.GameService;
import com.dainws.games.crm.usecase.LoadUsecase;

@RestController
public class WebLoadController implements LoadController {

	private User userSession;
	private GameService gameService;
	private LoadUsecase loadUsecase;

	public WebLoadController(GameService gameService, LoadUsecase loadUsecase) {
		this.gameService = gameService;
		this.loadUsecase = loadUsecase;
	}

	@Override
	public ResourceManifestDto getResources(String gameCodeBase64UrlSafe) {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);
		PlayerCode playerCode = this.userSession.getCode().toPlayerCode();

		Manifest manifest = this.loadUsecase.getManifest(gameCode, playerCode);
		return ModelMapper.toResourceManifestDto(manifest);
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
