package com.dainws.games.crm.controller.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResourceManifestDto {

	@JsonProperty("fixed")
	private List<ResourceDto> fixed;

	@JsonProperty("dynamic")
	private List<ResourceDto> dynamic;

	public List<ResourceDto> getFixed() {
		return fixed;
	}

	public void setFixed(List<ResourceDto> fixed) {
		this.fixed = fixed;
	}

	public List<ResourceDto> getDynamic() {
		return dynamic;
	}

	public void setDynamic(List<ResourceDto> dynamic) {
		this.dynamic = dynamic;
	}
}
