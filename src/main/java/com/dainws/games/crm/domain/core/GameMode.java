package com.dainws.games.crm.domain.core;

import java.util.Objects;

public record GameMode(String text) {
	
	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		GameMode that = (GameMode) obj;
		return this.text.equalsIgnoreCase(that.text);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.text);
	}
	
	@Override
	public String toString() {
		return this.text;
	}
}
