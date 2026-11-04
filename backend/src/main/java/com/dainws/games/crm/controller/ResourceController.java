package com.dainws.games.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.dainws.games.crm.controller.dto.response.ResourceManifestDto;

public interface ResourceController {

	@GetMapping("/game/{gameCode}/resources")
	ResourceManifestDto getResources(@PathVariable("gameCode") String gameCodeBase64UrlSafe);
}
