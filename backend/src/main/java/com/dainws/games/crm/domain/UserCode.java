package com.dainws.games.crm.domain;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;

import com.dainws.games.crm.domain.core.player.PlayerCode;

public class UserCode {
	private String uuid;

	private UserCode(String uuid) {
		this.uuid = uuid;
	}

	public String text() {
		return this.uuid;
	}
	
	public PlayerCode toPlayerCode() {
		return PlayerCode.from(this.uuid);
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

	public static UserCode fromBase64UrlSafe(String uuidAsBase64UrlSafe) {
		Objects.requireNonNull(uuidAsBase64UrlSafe);

		String asString = new String(Base64.getUrlDecoder().decode(uuidAsBase64UrlSafe), StandardCharsets.UTF_8);
		return from(asString);
	}

	public static UserCode from(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		return new UserCode(uuid);
	}
}
