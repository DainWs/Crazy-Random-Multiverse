package com.dainws.games.crm.domain.model;

import java.util.Objects;

public class UserCode {
	private String uuid;

	private UserCode(String uuid) {
		this.uuid = uuid;
	}

	public String getValue() {
		return this.uuid;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		UserCode that = (UserCode) obj;
		return this.uuid.contentEquals(that.uuid);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.uuid);
	}
	
	@Override
	public String toString() {
		return this.uuid;
	}

	public static UserCode fromString(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		return new UserCode(uuid);
	}
}
