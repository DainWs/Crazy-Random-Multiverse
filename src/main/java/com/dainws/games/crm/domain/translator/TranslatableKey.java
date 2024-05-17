package com.dainws.games.crm.domain.translator;

import java.util.Objects;

public class TranslatableKey {
	private String value;

	public TranslatableKey(String value) {
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

		TranslatableKey that = (TranslatableKey) obj;
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
