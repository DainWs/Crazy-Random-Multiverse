package com.dainws.games.crm.domain.core.exception;

import java.util.Objects;

public class ExceptionCode {
	private String value;

	public ExceptionCode(String value) {
		this.value = "exception." + value;

		if (value.startsWith("exception.")) {
			this.value = value;
		}
	}

	public String value() {
		return value;
	}
	
	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}

		if (!(other instanceof ExceptionCode otherCode)) {
			return false;
		}

		return this.value.equals(otherCode.value);
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
