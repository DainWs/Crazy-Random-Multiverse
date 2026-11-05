package com.dainws.games.crm.domain.resources;

import java.util.Objects;

public class GameResource {

	private String key;
	private ResourceType type;
	private String url;

	public GameResource(String key, ResourceType type, String url) {
		this.key = Objects.requireNonNull(key);
		this.type = Objects.requireNonNull(type);
		this.url = Objects.requireNonNull(url);
	}

	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = Objects.requireNonNull(key);
	}

	public ResourceType getType() {
		return this.type;
	}

	public void setType(ResourceType type) {
		this.type = Objects.requireNonNull(type);
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = Objects.requireNonNull(url);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == this) {
			return true;
		}

		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		GameResource that = (GameResource) obj;
		return this.key.equals(that.key) //
			&& this.type == that.type //
			&& this.url.equals(that.url);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.key, this.type, this.url);
	}

	@Override
	public String toString() {
		return "%s %s %s".formatted(this.type, this.key, this.url);
	}
}
