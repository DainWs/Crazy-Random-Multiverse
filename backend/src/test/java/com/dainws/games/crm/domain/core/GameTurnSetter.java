package com.dainws.games.crm.domain.core;

public final class GameTurnSetter {

	private GameTurnSetter() {
	}

	public static void setTurn(Game game, Turn turn) {
		game.setTurn(turn);
	}
}
