package com.dainws.games.crm.domain.mode.pvsai;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.Party;
import com.dainws.games.crm.domain.User;
import com.dainws.games.crm.domain.UserPlayer;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.Behavior;
import com.dainws.games.crm.domain.ai.goals.BaseGoalManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedActionManager;
import com.dainws.games.crm.domain.ai.score.ScoreBasedDecisionEngine;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameMode;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.mode.GameModeFactory;
import com.dainws.games.crm.domain.mode.classic.ClassicDealStrategyFactory;

public class PvsAIGameModeFactory implements GameModeFactory {
	private Deck deck;

	public PvsAIGameModeFactory(Deck deck) {
		this.deck = deck;
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
		PvsAIGame aiGame = new PvsAIGame(this.createDealer(), players);
		aiGame.setBoard(board);
		return aiGame;
	}

	private Behavior createBehavior() {
		Behavior behavior = new Behavior();
		behavior.setActionManager(new ScoreBasedActionManager());
		behavior.setDecisionEngine(new ScoreBasedDecisionEngine());
		behavior.setGoalManager(new BaseGoalManager());
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
}
