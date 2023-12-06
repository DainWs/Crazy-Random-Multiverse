package com.dainws.games.cbg.domain.text;

import java.util.Objects;

public class TextKey {
	private String value;

	public TextKey(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj == null || obj.getClass() != this.getClass()) {
			return false;
		}

		TextKey that = (TextKey) obj;
		return Objects.equals(this.value, that.value);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.value);
	}
	
	@Override
	public String toString() {
		return this.value;
	}
}
