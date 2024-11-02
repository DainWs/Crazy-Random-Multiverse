package com.dainws.games.crm.tools.domain.ai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.GameStageTest;
import com.dainws.games.crm.tools.domain.builder.AIPlayerBuilder;

public abstract class AIGameStageTest extends GameStageTest {

	private final int countOfNonAIPlayers;
	protected final PlayerActionExecutorMonitor actionExecutorMonitor;
	protected List<Player> nonAIPlayers;
	protected AIPlayer aiPlayer;

	protected AIGameStageTest() {
		this(1);
	}
	
	protected AIGameStageTest(int countOfNonAIPlayers) {
		super(countOfNonAIPlayers + 1);
		this.nonAIPlayers = new ArrayList<>();
		this.countOfNonAIPlayers = countOfNonAIPlayers;
		this.actionExecutorMonitor = new PlayerActionExecutorMonitor();
	}

	protected final Player createPlayer() {
		if (this.nonAIPlayers.size() < this.countOfNonAIPlayers) {
			Player player = this.createNonAIPlayer();
			this.nonAIPlayers.add(player);
			return player;
		}

		Behavior behavior = this.createBehavior();
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

	protected Behavior createBehavior() {
		return new Behavior();
	}
	
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
