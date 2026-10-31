package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.GameLifeCycle.Status;

public final class GameStatusSetter {

	private GameStatusSetter() {
	}

	public static void setStatus(Game game, Status status) {
		game.setStatus(status);
	}
}
