package com.dainws.games.crm.domain.ai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.GameBehaviorIntegrationTest;
import com.dainws.games.crm.domain.builder.AIPlayerBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.action.ActionMonitor;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class AIGameBehaviorIntegrationTest extends GameBehaviorIntegrationTest {

	private final int countOfNonAIPlayers;
	protected ActionMonitor actionMonitor;
	protected List<Player> nonAIPlayers;
	protected AIPlayer aiPlayer;

	protected AIGameBehaviorIntegrationTest() {
		this(1);
	}
	
	protected AIGameBehaviorIntegrationTest(int countOfNonAIPlayers) {
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
