package com.dainws.games.crm.domain.mode.pvsai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.ai.decision.ScoreBasedDecisionEngine;
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

public class PvsAIGameModeFactory implements GameModeFactory {
	private Deck deck;
	private PlayerActionExecutor actionExecutor;

	public PvsAIGameModeFactory(Deck deck) {
		this.deck = deck;
		this.actionExecutor = new PlayerActionExecutor();
	}

	public PvsAIGameModeFactory(Deck deck, PlayerActionExecutor actionExecutor) {
		this.deck = deck;
		this.actionExecutor = actionExecutor;
	}

	@Override
	public GameMode getMode() {
		return new GameMode("PLAYER_VS_AI");
	}

	@Override
	public Game createGame(Party party) {
		List<Player> players = new ArrayList<>();
		for (User user : party.getUsers()) {
			players.add(new UserPlayer(user));

			String aiName = "Player " + players.size();
			players.add(new AIPlayer(this.createBehavior(), aiName));
		}

		Board board = new Board(this::createZoneWithLeader, players);
		return new PvsAIGame(board, this.createDealer(), players);
	}

	private Behavior createBehavior() {
		Behavior behavior = new Behavior(this.actionExecutor);
		behavior.setActionManager(new PvsAIActionManager());
		behavior.setDecisionEngine(new ScoreBasedDecisionEngine());
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
