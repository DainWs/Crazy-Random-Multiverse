package com.dainws.games.crm.controller.dto.response;

import com.dainws.games.crm.domain.resources.ResourceType;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ResourceDto {

	@JsonProperty("key")
	private String key;

	@JsonProperty("type")
	private ResourceType type;

	@JsonProperty("url")
	private String url;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public ResourceType getType() {
		return type;
	}

	public void setType(ResourceType type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
