package com.dainws.games.crm.domain;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import java.util.UUID;

import com.dainws.games.crm.domain.core.exception.InvalidCodeException;

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
		
		try {
			String asString = new String(Base64.getUrlDecoder().decode(uuidAsBase64UrlSafe), StandardCharsets.UTF_8);
			return from(asString);
		} catch (IllegalArgumentException exception) {
			throw new InvalidCodeException(exception);
		}
	}

	public static PartyCode from(String uuidAsString) {
		Objects.requireNonNull(uuidAsString);

		PartyCode partyCode = new PartyCode();
		partyCode.uuid = UUID.fromString(uuidAsString);
		return partyCode;
	}
}
