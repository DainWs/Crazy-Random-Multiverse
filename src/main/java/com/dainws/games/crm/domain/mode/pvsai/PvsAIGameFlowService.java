package com.dainws.games.crm.domain.mode.pvsai;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGame;
import com.dainws.games.crm.domain.mode.classic.ClassicGameFlowService;

public class PvsAIGameFlowService extends ClassicGameFlowService {

	@Override
	public void startGame(ClassicGame game) {
		super.startGame(game);

		this.performAITurn(game);
	}

	@Override
	public void nextTurn(ClassicGame game) {
		super.nextTurn(game);

		if (game.isRunning()) {
			this.performAITurn(game);
		}
	}

	@Override
	public void prevTurn(ClassicGame game) {
		super.prevTurn(game);

		if (game.isRunning()) {
			this.performAITurn(game);
		}
	}

	private void performAITurn(ClassicGame game) {
		Player playerWithTurn = game.getPlayerWithTurn();
		if (playerWithTurn instanceof AIPlayer aiPlayer) {
			aiPlayer.performBehavior(game);
		}
	}
}
