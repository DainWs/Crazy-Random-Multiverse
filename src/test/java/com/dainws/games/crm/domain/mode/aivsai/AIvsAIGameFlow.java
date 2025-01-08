package com.dainws.games.crm.domain.mode.aivsai;

import com.dainws.games.crm.domain.core.CompositeGameFlow;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameFlow;

public class AIvsAIGameFlow extends CompositeGameFlow {

	public AIvsAIGameFlow() {
		this(new PvsAIGameFlow());
	}

	public AIvsAIGameFlow(PvsAIGameFlow wrapper) {
		super(wrapper);
	}

	@Override
	public void onStartGame(Game game) {
		super.onStartGame(game);
	}

	@Override
	public void onNextTurn(Game game) {
		super.onNextTurn(game);
	}

	@Override
	public void onPrevTurn(Game game) {
		super.onPrevTurn(game);
	}
}
