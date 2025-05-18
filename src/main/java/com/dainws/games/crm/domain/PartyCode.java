package com.dainws.games.crm.domain;

import java.util.Objects;
import java.util.UUID;

import org.apache.tomcat.util.codec.binary.Base64;

public class PartyCode {
	private UUID uuid;

	public PartyCode() {
		this.uuid = UUID.randomUUID();
	}

	public String text() {
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

	public static PartyCode fromBase64UrlSafe(String uuidAsBase64UrlSafe) {
		Objects.requireNonNull(uuidAsBase64UrlSafe);
		
		String asString = new String(Base64.decodeBase64URLSafe(uuidAsBase64UrlSafe));
		return from(asString);
	}

	public static PartyCode from(String uuidAsString) {
		Objects.requireNonNull(uuidAsString);

		PartyCode partyCode = new PartyCode();
		partyCode.uuid = UUID.fromString(uuidAsString);
		return partyCode;
	}
}
