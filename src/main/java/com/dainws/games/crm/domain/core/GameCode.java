package com.dainws.games.crm.domain.core;

import java.util.Objects;
import java.util.UUID;

import org.apache.tomcat.util.codec.binary.Base64;

public class GameCode {
	public static final GameCode NONE = new GameCode(null);
	
	private UUID uuid;

	public GameCode() {
		this.uuid = UUID.randomUUID();
	}
	
	private GameCode(UUID uuid) {
		this.uuid = uuid;
	}

	public String text() {
		return this.uuid.toString();
	}
	
	public boolean isNone() {
		return this.uuid == null;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || this.getClass() != obj.getClass()) {
			return false;
		}

		GameCode that = (GameCode) obj;
		return this.uuid != null && this.uuid.equals(that.uuid);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.uuid);
	}
	
	@Override
	public String toString() {
		return this.uuid.toString();
	}
	
	public static GameCode fromBase64UrlSafe(String uuidAsBase64UrlSafe) {
		Objects.requireNonNull(uuidAsBase64UrlSafe);
		
		String asString = new String(Base64.decodeBase64URLSafe(uuidAsBase64UrlSafe));
		return from(asString);
	}

	public static GameCode from(String uuidAsString) {
		Objects.requireNonNull(uuidAsString);

		UUID uuid = UUID.fromString(uuidAsString);
		return new GameCode(uuid);
	}
}
