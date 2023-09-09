package com.dainws.games.cbg.domain.player;

public class PlayerFactory {
	public Player createBasicPlayer() {
		return Player.builder()
				.withPlayerCode("test-playercode")
				.withName("test-player")
				.build();
	}
}
