package com.dainws.games.crm.domain.mode.pvsai;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.core.CompositeGameFlow;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.classic.ClassicGameFlow;

public class PvsAIGameFlow extends CompositeGameFlow {

	public PvsAIGameFlow() {
		this(new ClassicGameFlow());
	}

	public PvsAIGameFlow(ClassicGameFlow wrapper) {
		super(wrapper);
	}

	@Override
	public void onStartGame(Game game) {
		super.onStartGame(game);

		this.performAITurn(game);
	}

	@Override
	public void onNextTurn(Game game) {
		super.onNextTurn(game);

		if (game.isRunning()) {
			this.performAITurn(game);
		}
	}

	@Override
	public void onPrevTurn(Game game) {
		super.onPrevTurn(game);

		if (game.isRunning()) {
			this.performAITurn(game);
		}
	}

	private void performAITurn(Game game) {
		Player playerWithTurn = game.getPlayerWithTurn();
		if (playerWithTurn instanceof AIPlayer aiPlayer) {
			aiPlayer.performBehavior(game);
		}
	}
}
