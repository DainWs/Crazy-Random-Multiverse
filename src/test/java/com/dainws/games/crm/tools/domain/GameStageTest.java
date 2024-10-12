package com.dainws.games.crm.tools.domain;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;

import com.dainws.games.crm.domain.core.DummyGame;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameState;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.builder.PlayerBuilder;
import com.dainws.games.crm.tools.domain.core.dealer.MemoryDeckPopulator;

public abstract class GameStageTest {
	private final int countOfPlayers;
	protected Dealer dealer;
	protected Game game;

	protected GameStageTest(int countOfPlayers) {
		this.countOfPlayers = countOfPlayers;
	}

	@BeforeEach
	final void abstractBeforeEach() {
		List<Player> players = this.createAllPlayers();
		this.dealer = this.createDealer();
		this.game = this.createGame(players);
		this.prepareGame(this.game);

		this.beforeEach();
	}

	protected abstract void beforeEach();

	private List<Player> createAllPlayers() {
		List<Player> players = new ArrayList<>();
		for (int i = 0; i < this.countOfPlayers; i++) {
			players.add(this.createPlayer());
		}
		return players;
	}

	protected Dealer createDealer() {
		Deck deck = new MemoryDeckPopulator().populate();
		return new Dealer(deck);
	}
	
	protected Game createGame(List<Player> players) {
		return new DummyGame(players);
	}
	
	protected void prepareGame(Game game) {
		game.setState(GameState.BEFORE_START);
	}
	
	protected Player createPlayer() {
		return PlayerBuilder.dummyPlayer();
	}
	
	protected void playTurnOfCurrentPlayer() {
		this.dealer.dealCardsToPlayerWithTurn(this.game);
		this.putCardInHandOnBoard();
		this.attackWithCardsInBoard();
		
		int turn = this.game.getTurn();
		this.game.setTurn(turn + 1);
	}

	protected void putCardInHandOnBoard() {
		Board board = this.game.getBoard();
		Player playerWithTurn = this.game.getPlayerWithTurn();

		Zone zone = board.getZoneOf(playerWithTurn);
		Hand hand = playerWithTurn.getHand();
		Combatant card = this.getCombatantFromHand(hand);
		zone.addCombatant(card);
	}

	private Combatant getCombatantFromHand(Hand hand) {
		if (hand.contains(CardType.LEADER)) {
			return (Combatant) hand.getCardsOf(CardType.LEADER).get(0);
		}

		return (Combatant) hand.getCardsOf(CardType.LEADER).get(0);
	}

	protected void attackWithCardsInBoard() {
		Board board = this.game.getBoard();
		
		Player playerWithTurn = this.game.getPlayerWithTurn();
		
		Zone zone = board.getZoneOf(playerWithTurn);
		Hand hand = playerWithTurn.getHand();
		Combatant card = this.getCombatantFromHand(hand);
		zone.addCombatant(card);
	}
}
