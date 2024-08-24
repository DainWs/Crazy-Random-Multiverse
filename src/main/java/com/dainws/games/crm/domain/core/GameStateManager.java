package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.player.Player;

public abstract class GameStateManager {
	protected GameStateManager() {}

	public void next(Game game) {
		if (this.isGameInStartState(game)) {
			this.doStartStateProcess(game);
		}

		if (this.isGameInEndState(game)) {
			this.doEndStateProcess(game);
		}
	}

	protected boolean isGameInStartState(Game game) {
		return game.getRound() < 0;
	}
	
	protected boolean isGameInEndState(Game game) {
		return this.getCountOfAlivePlayersIn(game) <= 1;
	}

	protected abstract void doStartStateProcess(Game game);

	protected abstract void doEndStateProcess(Game game);

	protected int getCountOfAlivePlayersIn(Game game) {
		int alivePlayersCount = 0;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				alivePlayersCount++;
			}
		}

		return alivePlayersCount;
	}

	protected Player getWinnerIn(Game game) {
		Player winner = null;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				winner = player;
			}
		}

		return winner;
	}
}
