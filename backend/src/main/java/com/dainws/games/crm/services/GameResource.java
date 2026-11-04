package com.dainws.games.crm.services;

import java.util.Objects;

public record GameResource(String key, ResourceType type, String url) {

	public GameResource {
		Objects.requireNonNull(key);
		Objects.requireNonNull(type);
		Objects.requireNonNull(url);
	}
}
