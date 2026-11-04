package com.dainws.games.crm.services;

import java.util.List;

public record ResourceManifest(List<GameResource> fixed, List<GameResource> dynamic) {

	public ResourceManifest {
		fixed = List.copyOf(fixed);
		dynamic = List.copyOf(dynamic);
	}
}
