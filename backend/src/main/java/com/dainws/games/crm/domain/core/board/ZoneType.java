package com.dainws.games.crm.domain.core.board;

import java.util.Objects;

public record ZoneType(String text) {

	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		ZoneType that = (ZoneType) obj;
		return this.text.equals(that.text);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.text);
	}
}
