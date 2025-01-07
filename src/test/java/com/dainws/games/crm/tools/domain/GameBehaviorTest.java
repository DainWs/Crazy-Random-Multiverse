package com.dainws.games.crm.tools.domain;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameFlow;
import com.dainws.games.crm.domain.core.GameLifeCycle;
import com.dainws.games.crm.domain.core.GameModeStrategy;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.dealer.DealStrategyFactory;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStorage;
import com.dainws.games.crm.domain.mode.classic.ClassicDealStrategyFactory;
import com.dainws.games.crm.domain.mode.classic.ClassicGameFlow;
import com.dainws.games.crm.tools.domain.builder.PlayerBuilder;
import com.dainws.games.crm.tools.domain.core.DummyGameStrategy;
import com.dainws.games.crm.tools.domain.core.MonitoredGameStrategy;
import com.dainws.games.crm.tools.domain.core.dealer.MemoryDeckPopulator;
import com.dainws.games.crm.tools.domain.core.event.EventMonitor;
import com.dainws.games.crm.tools.domain.core.exception.ExceptionMonitor;

public abstract class GameBehaviorTest {
	private final int countOfPlayers;

	protected final GameLifeCycle gameLifeCycle;
	protected final GameFlow gameFlow;

	protected EventMonitor eventMonitor;
	protected ExceptionMonitor exceptionMonitor;
	
	protected PlayerStorage players;
	protected Dealer dealer;
	protected Game game;

	protected GameBehaviorTest(int countOfPlayers) {
		this.countOfPlayers = countOfPlayers;
		this.gameLifeCycle = new GameLifeCycle();
		this.gameFlow = this.createGameFlow();
	}

	protected GameFlow createGameFlow() {
		return new ClassicGameFlow();
	}

	@BeforeEach
	final void abstractBeforeEach() {
		this.players = this.createAllPlayers();
		this.dealer = this.createDealer();

		GameModeStrategy strategy = this.createGameModeStrategy();
		this.game = this.createGame(strategy);
		this.prepareGame(this.game);

		this.beforeEach();
	}

	protected abstract void beforeEach();

	private PlayerStorage createAllPlayers() {
		List<Player> players = new ArrayList<>();
		for (int i = 0; i < this.countOfPlayers; i++) {
			players.add(this.createPlayer());
		}

		return new PlayerStorage(players);
	}

	protected Dealer createDealer() {
		Deck deck = new MemoryDeckPopulator().populate();
		Dealer dealer = new Dealer(deck);
		dealer.setDealStrategyFactory(this.createDealStrategyFactory());
		return dealer;
	}

	protected DealStrategyFactory createDealStrategyFactory() {
		return new ClassicDealStrategyFactory();
	}

	protected GameModeStrategy createGameModeStrategy() {
		DummyGameStrategy strategy = new DummyGameStrategy();
		strategy.setDealer(this.dealer);
		strategy.setPlayers(this.players);
		strategy.setZoneFactory(ZoneWithLeader::new);

		MonitoredGameStrategy monitoredStrategy = new MonitoredGameStrategy(strategy);
		monitoredStrategy.setEventPublisher(this.createEventPublisher());
		monitoredStrategy.setExceptionPublisher(this.createExceptionPublisher());
		this.eventMonitor = monitoredStrategy.getEventPublisherMonitor();
		this.exceptionMonitor = monitoredStrategy.getExceptionMonitor();
		return monitoredStrategy;
	}
	
	protected EventPublisher createEventPublisher() {
		return EventPublisher.NONE;
	}
	
	protected ExceptionPublisher createExceptionPublisher() {
		return ExceptionPublisher.NONE;
	}

	protected Game createGame(GameModeStrategy strategy) {
		return new Game(strategy);
	}

	protected void prepareGame(Game game) {
		this.gameLifeCycle.register(this.game, (player) -> false);
		this.gameLifeCycle.startLoading(game);

		for (Player player : this.players) {
			this.gameLifeCycle.loadCompleteFor(game, player.getPlayerCode());
		}

		this.gameFlow.onStartGame(game);
	}

	protected Player createPlayer() {
		return PlayerBuilder.dummyPlayer();
	}

	protected void playTurnOfCurrentPlayer() {
		this.putCardInHandOnBoard();
		this.attackWithCardsInBoard();

		this.gameFlow.onNextTurn(this.game);
	}

	protected void putCardInHandOnBoard() {
		try {
			Board board = this.game.getBoard();
			Player playerWithTurn = this.game.getPlayerWithTurn();

			Zone zone = board.getZoneOf(playerWithTurn);
			Hand hand = playerWithTurn.getHand();
			Combatant card = this.getCombatantFromHand(hand);
			zone.addCombatant(card);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private Combatant getCombatantFromHand(Hand hand) {
		if (hand.contains(CardType.LEADER)) {
			return (Combatant) hand.getCardsOf(CardType.LEADER).get(0);
		}

		return (Combatant) hand.getCardsOf(CardType.WARRIOR).get(0);
	}

	protected void attackWithCardsInBoard() {
		try {
			Board board = this.game.getBoard();

			Player playerWithTurn = this.game.getPlayerWithTurn();

			Zone zone = board.getZoneOf(playerWithTurn);
			Hand hand = playerWithTurn.getHand();
			Combatant card = this.getCombatantFromHand(hand);
			zone.addCombatant(card);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
