package com.dainws.games.crm.domain;

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

	public static UserCode from(String uuid) {
		if (uuid == null) {
			throw new NullPointerException("El UUID indicado es nulo");
		}

		return new UserCode(uuid);
	}
}
