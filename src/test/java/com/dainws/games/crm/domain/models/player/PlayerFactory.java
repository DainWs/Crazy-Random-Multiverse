package com.dainws.games.crm.domain.models.player;

import com.dainws.games.crm.domain.models.player.Player;

public class PlayerFactory {
	public Player createBasicPlayer() {
		return Player.builder()
				.withPlayerCode("test-playercode")
				.withName("test-player")
				.build();
	}
}
