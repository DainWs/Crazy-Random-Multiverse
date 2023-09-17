package com.dainws.games.crm.console.domain.models;

import java.util.Objects;
import java.util.UUID;

public class UserCode {
	private UUID uuid;

	public UserCode() {
		this.uuid = UUID.randomUUID();
	}

	public String getValue() {
		return this.uuid.toString();
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		UserCode that = (UserCode) obj;
		return this.uuid.equals(that.uuid);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.uuid);
	}
	
	@Override
	public String toString() {
		return this.uuid.toString();
	}

	public static UserCode fromString(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		UserCode partyCode = new UserCode();
		partyCode.uuid = UUID.fromString(uuid);
		return partyCode;
	}
}
