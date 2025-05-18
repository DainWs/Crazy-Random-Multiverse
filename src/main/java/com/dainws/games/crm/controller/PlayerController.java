package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.dainws.games.crm.controller.dto.domain.ActionDto;

public interface PlayerController {

	@PostMapping("/game/{gameCode}/action")
	public void dispatchAction(
			@PathVariable("gameCode") String gameCodeAsString, 
			@RequestBody ActionDto actionDto
	) throws IllegalAccessException;

}
