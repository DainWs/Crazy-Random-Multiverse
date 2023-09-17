package com.dainws.games.cbg.domain;

import java.util.Objects;
import java.util.UUID;

public class GameCode {
	private UUID uuid;

	public GameCode() {
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

		GameCode that = (GameCode) obj;
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

	public static GameCode fromString(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		GameCode gameCode = new GameCode();
		gameCode.uuid = UUID.fromString(uuid);
		return gameCode;
	}
}
