package com.dainws.games.crm.domain.ai.decision;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Player;

public class NoneDecisionEngine extends ContextDecisionEngine {
	
	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

	@Override
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		return null;
	}

}
