package com.dainws.games.crm.domain.mode.aivsai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerActionExecutor;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.classic.ClassicDealStrategyFactory;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIActionManager;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIDecisionEngine;
import com.dainws.games.crm.domain.mode.pvsai.PvsAIGoalManager;

public class AIvsAIGameModeFactory implements GameModeFactory {
	private int numOfPlayers;
	private Deck deck;
	private PlayerActionExecutor actionExecutor;

	public AIvsAIGameModeFactory(Deck deck) {
		this(deck, new PlayerActionExecutor());
	}

	public AIvsAIGameModeFactory(Deck deck, PlayerActionExecutor actionExecutor) {
		this.numOfPlayers = 2;
		this.deck = deck;
		this.actionExecutor = actionExecutor;
	}

	@Override
	public GameMode getMode() {
		return new GameMode("AI_VS_AI");
	}

	public Game createGame() {
		return this.createGame(this.numOfPlayers);
	}

	@Override
	public Game createGame(Party party) {
		return this.createGame(this.numOfPlayers);
	}

	public Game createGame(int numOfPlayers) {
		List<Player> players = new ArrayList<>();
		for (int i = 0; i < this.numOfPlayers; i++) {
			Behavior behavior = this.createBehavior();
			AIPlayer ai = new AIPlayer(behavior, "Player "+i);
			players.add(ai);
		}

		Board board = new Board(this::createZoneWithLeader, players);
		return new AIvsAIGame(board, this.createDealer(), players);
	}

	private Behavior createBehavior() {
		Behavior behavior = new Behavior(this.actionExecutor);
		behavior.setActionManager(new PvsAIActionManager());
		behavior.setDecisionEngine(new PvsAIDecisionEngine());
		behavior.setGoalManager(new PvsAIGoalManager());
		return behavior;
	}
	
	private Dealer createDealer() {
		Dealer dealer = new Dealer(this.deck);
		dealer.setDealStrategyFactory(new ClassicDealStrategyFactory());
		return dealer;
	}

	private Zone createZoneWithLeader() {
		return new ZoneWithLeader();
	}

	public void setActionExecutor(PlayerActionExecutor actionExecutor) {
		this.actionExecutor = actionExecutor;
	}
}
