package com.dainws.games.crm.domain.mode.pvsai;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.ai.goals.BaseGoalManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedActionManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedDecisionEngine;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.classic.ClassicGameStrategy;

public class PvsAIGameStrategy extends ClassicGameStrategy {
	public static final GameMode PVSAI_MODE = new GameMode("PLAYER_VS_AI");

	public PvsAIGameStrategy(Party party, Deck deck) {
		super(party, deck);
	}

	@Override
	public PlayerStorage createPlayerStorage() {
		PlayerStorage players = super.createPlayerStorage();

		for (int i = 0; i < players.size(); i++) {
			String aiName = "Player " + i;
			players.add(new AIPlayer(this.createBehavior(), aiName));
		}

		return players;
	}

	private Behavior createBehavior() {
		Behavior behavior = new Behavior();
		behavior.setActionManager(new ScoreBasedActionManager());
		behavior.setDecisionEngine(new ScoreBasedDecisionEngine());
		behavior.setGoalManager(new BaseGoalManager());
		return behavior;
	}
	
	@Override
	public ExceptionPublisher createExceptionPublisher(Game game) {
		ExceptionPublisher exceptionPublisher = super.createExceptionPublisher(game);
		return new PvsAIExceptionPublisher(exceptionPublisher);
	}

	@Override
	public GameMode getGameMode() {
		return PVSAI_MODE;
	}

}