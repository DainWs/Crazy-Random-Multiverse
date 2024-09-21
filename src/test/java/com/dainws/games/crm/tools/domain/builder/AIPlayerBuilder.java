package com.dainws.games.crm.tools.domain.builder;

import java.util.Objects;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;

public class AIPlayerBuilder {
	public static AIPlayer basicAIPlayer() {
		return AIPlayerBuilder.customAIPlayer(new Behavior());
	}
	
	public static AIPlayer customAIPlayer(Behavior behavior) {
		Objects.requireNonNull(behavior);
		String random = String.valueOf(Math.random() * 1000000);
		return new AIPlayer(behavior, random);
	}
}
