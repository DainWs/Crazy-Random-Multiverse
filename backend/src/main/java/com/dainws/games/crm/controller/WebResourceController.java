package com.dainws.games.crm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.dainws.games.crm.controller.dto.ModelMapper;
import com.dainws.games.crm.controller.dto.response.ResourceManifestDto;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.player.PlayerCode;
import com.dainws.games.crm.services.ResourceService;

@RestController
public class WebResourceController implements ResourceController {

	private User userSession;
	private ResourceService resourceService;

	public WebResourceController(ResourceService resourceService) {
		this.resourceService = resourceService;
	}

	@Override
	public ResourceManifestDto getResources(String gameCodeBase64UrlSafe) {
		GameCode gameCode = GameCode.fromBase64UrlSafe(gameCodeBase64UrlSafe);
		PlayerCode playerCode = this.userSession.getCode().toPlayerCode();
		return ModelMapper.toResourceManifestDto(this.resourceService.getManifest(gameCode, playerCode));
	}

	@Autowired
	public void setUserSession(User userSession) {
		this.userSession = userSession;
	}
}
