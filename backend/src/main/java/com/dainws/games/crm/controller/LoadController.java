package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.dainws.games.crm.controller.dto.response.ResourceManifestDto;

public interface LoadController {

	@GetMapping("/game/{gameCode}/resources")
	ResourceManifestDto getResources(@PathVariable("gameCode") String gameCodeBase64UrlSafe);

	@PostMapping("/game/{gameCode}/ready")
	void readyToStart(@PathVariable("gameCode") String gameCodeBase64UrlSafe);
}
