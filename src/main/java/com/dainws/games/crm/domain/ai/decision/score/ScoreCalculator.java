package com.dainws.games.crm.domain.ai.decision.score;

import com.dainws.games.crm.domain.core.Game;

public interface ScoreCalculator<T> {
	
	Score calculate(Game game, T t);
}
