package com.dainws.games.crm.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.dainws.games.crm.controller.dto.domain.ActionDto;

public interface PlayerController {

	@PostMapping(value = "/game/{gameCode}/action",
			consumes = MediaType.APPLICATION_JSON_VALUE
	)
	public void dispatchAction(
			@PathVariable("gameCode") String gameCodeBase64UrlSafe, 
			@RequestBody ActionDto actionDto
	) throws IllegalAccessException;

}
