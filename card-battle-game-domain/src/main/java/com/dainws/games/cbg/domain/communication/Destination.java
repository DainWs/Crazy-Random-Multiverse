package com.dainws.games.cbg.domain.communication;

import com.dainws.games.cbg.domain.player.Player;

public class Destination {
	private String value;

	private Destination(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}
	
	@Override
	public String toString() {
		return this.value;
	}
	
	public static Destination of(Player player) {
		return new Destination(player.getCode());
	}
	
	public static Destination from(String uid) {
		return new Destination(uid);
	}
}
