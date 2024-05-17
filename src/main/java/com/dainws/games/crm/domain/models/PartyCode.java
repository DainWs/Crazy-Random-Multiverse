package com.dainws.games.crm.domain.models;

import java.util.Objects;
import java.util.UUID;

public class PartyCode {
	private UUID uuid;

	public PartyCode() {
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

		PartyCode that = (PartyCode) obj;
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

	public static PartyCode fromString(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		PartyCode partyCode = new PartyCode();
		partyCode.uuid = UUID.fromString(uuid);
		return partyCode;
	}
}
