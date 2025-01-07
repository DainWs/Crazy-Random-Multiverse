package com.dainws.games.crm.domain.mode.aivsai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.ai.goals.BaseGoalManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedActionManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedDecisionEngine;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGameStrategy;

public class AIvsAIGameStrategy extends PvsAIGameStrategy {
	public static final GameMode AIVSAI_MODE = new GameMode("AI_VS_AI");

	private int numOfAIPlayers;
	
	public AIvsAIGameStrategy(Party party, Deck deck) {
		super(party, deck);
		this.numOfAIPlayers = party.getUsers().size();
		
		if (this.numOfAIPlayers < 2) {
			this.numOfAIPlayers = 2;
		}
	}
	
	@Override
	public PlayerStorage createPlayerStorage() {
		List<Player> players = new ArrayList<>();

		for (int i = 0; i < this.numOfAIPlayers; i++) {
			String aiName = "Player " + i;
			players.add(new AIPlayer(this.createBehavior(), aiName));
		}

		return new PlayerStorage(players);
	}
	
	private Behavior createBehavior() {
		Behavior behavior = new Behavior();
		behavior.setActionManager(new ScoreBasedActionManager());
		behavior.setDecisionEngine(new ScoreBasedDecisionEngine());
		behavior.setGoalManager(new BaseGoalManager());
		return behavior;
	}

}
