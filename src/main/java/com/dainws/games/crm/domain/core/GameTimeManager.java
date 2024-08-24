package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.player.Player;

// TODO cooldown reduction deberia estar aqui
public abstract class GameTimeManager {

	private static final int FIRST_TURN = 0;
	private static final int FIRST_ROUND = 1;

	protected GameTimeManager() {}
	
	public void resetTurnAndRoundOf(Game game) {
		game.setTurn(FIRST_TURN);
		game.setRound(FIRST_ROUND);
	}

	public final void nextTurnOf(Game game) {
		int nextTurn = game.getTurn() + 1;
		int lastTurn = this.getLastTurnOf(game);

		if (nextTurn >= lastTurn) {
			nextTurn = FIRST_TURN;
		}

		if (nextTurn == FIRST_TURN) {
			this.nextRoundOf(game);
		}

		game.setTurn(nextTurn);
		this.onNextTurn(game);
	}
	
	protected abstract void onNextTurn(Game game);

	public final void prevTurnOf(Game game) {
		int prevTurn = game.getTurn() - 1;
		int lastTurn = this.getLastTurnOf(game);

		if (prevTurn < FIRST_TURN) {
			prevTurn = lastTurn;
		}
		
		if (prevTurn == lastTurn) {
			this.prevRoundOf(game);
		}

		game.setTurn(prevTurn);
		this.onPrevTurn(game);
	}

	protected abstract void onPrevTurn(Game game);

	public final void nextRoundOf(Game game) {
		int nextRound = game.getRound() + 1;

		game.setRound(nextRound);
		this.onNextRound(game);
	}

	protected abstract void onNextRound(Game game);

	public final void prevRoundOf(Game game) {
		int prevRound = game.getRound() - 1;
		if (prevRound < FIRST_ROUND) {
			prevRound = FIRST_ROUND;
		}

		game.setRound(prevRound);
		this.onPrevRound(game);
	}

	protected abstract void onPrevRound(Game game);

	private int getLastTurnOf(Game game) {
		int alivePlayersCount = 0;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				alivePlayersCount++;
			}
		}

		return alivePlayersCount;
	}
}
