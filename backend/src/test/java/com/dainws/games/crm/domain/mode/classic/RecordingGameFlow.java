package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;

public class RecordingGameFlow implements GameFlow {
	private int nextTurnCount;

	@Override
	public void onRestartGame(Game game) {
	}

	@Override
	public void onStartGame(Game game) {
	}

	@Override
	public void onEndGame(Game game) {
	}

	@Override
	public void onNextTurn(Game game) {
		this.nextTurnCount++;
	}

	@Override
	public void onPrevTurn(Game game) {
	}

	@Override
	public void updateGame(Game game) {
	}

	public int getNextTurnCount() {
		return this.nextTurnCount;
	}
}
