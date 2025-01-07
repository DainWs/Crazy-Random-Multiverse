package com.dainws.games.crm.tools.domain.ai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.GameBehaviorTest;
import com.dainws.games.crm.tools.domain.builder.AIPlayerBuilder;
import com.dainws.games.crm.tools.domain.core.action.ActionMonitor;

public abstract class AIGameBehaviorTest extends GameBehaviorTest {

	private final int countOfNonAIPlayers;
	protected ActionMonitor actionMonitor;
	protected List<Player> nonAIPlayers;
	protected AIPlayer aiPlayer;

	protected AIGameBehaviorTest() {
		this(1);
	}
	
	protected AIGameBehaviorTest(int countOfNonAIPlayers) {
		super(countOfNonAIPlayers + 1);
		this.nonAIPlayers = new ArrayList<>();
		this.countOfNonAIPlayers = countOfNonAIPlayers;
	}

	protected final Player createPlayer() {
		if (this.nonAIPlayers.size() < this.countOfNonAIPlayers) {
			Player player = this.createNonAIPlayer();
			this.nonAIPlayers.add(player);
			return player;
		}

		BehaviorMonitor behavior = new BehaviorMonitor();
		this.actionMonitor = behavior;
		this.prepareBehavior(behavior);
		AIPlayer aiPlayer = this.createAIPlayer(behavior);
		this.aiPlayer = aiPlayer;
		return aiPlayer;
	}

	protected Player createNonAIPlayer() {
		return super.createPlayer();
	}

	protected AIPlayer createAIPlayer(Behavior behavior) {
		return AIPlayerBuilder.customAIPlayer(behavior); 
	}

	protected void prepareBehavior(Behavior behavior) {}
	
	@Override
	protected void prepareGame(Game game) {
		super.prepareGame(game);

		Player playerWithTurn = this.game.getPlayerWithTurn();
		while(!playerWithTurn.equals(this.aiPlayer)) {
			this.playTurnOfCurrentPlayer();
			playerWithTurn = this.game.getPlayerWithTurn();
		}

		this.dealer.dealCardsToPlayerWithTurn(game);
	}
}
