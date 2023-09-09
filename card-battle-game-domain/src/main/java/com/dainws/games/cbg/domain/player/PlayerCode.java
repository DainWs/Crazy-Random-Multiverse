package com.dainws.games.cbg.domain.player;

import java.util.Objects;

public final class PlayerCode {

	private String code;

	private PlayerCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null || obj.getClass() != this.getClass())
			return false;

		PlayerCode that = (PlayerCode) obj;
		return this.code.contentEquals(that.code);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(this.code);
	}
	
	@Override
	public String toString() {
		return "player#%s".formatted(this.code);
	}
	
	public static PlayerCode newInstance(String code) {
		Objects.requireNonNull(code);
		return new PlayerCode(code);
	}
}

