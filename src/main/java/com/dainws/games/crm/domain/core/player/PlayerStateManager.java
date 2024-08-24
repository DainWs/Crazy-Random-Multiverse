package com.dainws.games.crm.domain.core.player;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;

public abstract class PlayerStateManager {
	protected PlayerStateManager() {
	}

	public void updateAlivePlayersOf(Game game) {
		for (Player player : game.getPlayers()) {
			if (this.shouldPlayerDie(game, player)) {
				player.die();
				this.onPlayerDie(game, player);
			}
		}
	}

	private boolean shouldPlayerDie(Game game, Player player) {
		if (player.isSpectator()) {
			return false;
		}

		Board board = game.getBoard();
		return board.isZoneAlive(player.getPlayerCode());
	}

	protected abstract void onPlayerDie(Game game, Player player);
}
