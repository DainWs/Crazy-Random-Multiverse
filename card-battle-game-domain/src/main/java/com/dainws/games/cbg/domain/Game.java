package com.dainws.games.cbg.domain;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.dainws.games.cbg.domain.dealer.DealStrategy;
import com.dainws.games.cbg.domain.dealer.DealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.Dealer;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.exception.NoSuchPlayerException;

public class Game {
	private GameCode gameCode;
	private int playerIndexWithTurn;
	private int round;

	private Dealer dealer;
	private List<Player> players;
	private DealStrategyFactory dealStrategyFactory; // TODO tal vez esto haya que hacerlo dinamico

	private Game(Builder builder) {
		this.gameCode = builder.gameCode;
		this.round = builder.round;
		this.dealer = new Dealer(builder.deck);
		this.players = builder.players;
		this.playerIndexWithTurn = 0;
		this.dealStrategyFactory = new DealStrategyFactory();
		
		if (builder.playerWithTurn != null) {
			this.playerIndexWithTurn = this.players.indexOf(builder.playerWithTurn);
		}
	}

	public void nextTurn() {
		this.playerIndexWithTurn++;

		if (this.playerIndexWithTurn >= this.players.size()) {
			this.playerIndexWithTurn = 0;
			this.nextRound();
		}
	}

	public void nextRound() {
		this.round++;

		this.updateDealStrategy();
	}

	public void updateDealStrategy() {
		DealStrategy dealStrategy = this.dealStrategyFactory.createStrategy(this.round);
		this.dealer.setStrategy(dealStrategy);
	}
	
	public void resetRoundAndTurn() {
		this.playerIndexWithTurn = 0;
		this.round = 0;
	}
	
	public boolean hasWinner() {
		int alivePlayersCount = 0;
		for (Player player : this.players) {
			if (player.isAlive()) {
				alivePlayersCount++;
			}
		}

		return alivePlayersCount == 1;
	}

	public GameCode getCode() {
		return gameCode;
	}

	public int getRound() {
		return this.round;
	}

	public Dealer getDealer() {
		return dealer;
	}

	public List<Player> getPlayers() {
		return players;
	}

	public Player getPlayerWithTurn() {
		return this.players.get(this.playerIndexWithTurn);
	}

	public Player getPlayer(PlayerCode playerCode) throws NoSuchPlayerException {
		Optional<Player> optional = Optional.empty();

		for (Player player : this.players) {
			if (player.getPlayerCode().equals(playerCode)) {
				optional = Optional.of(player);
			}
		}

		if (optional.isEmpty()) {
			throw new NoSuchPlayerException("No player with " + playerCode + " was found.");
		}

		return optional.get();
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private GameCode gameCode;
		private int round;
		private Deck deck;
		private List<Player> players;
		private Player playerWithTurn;

		private Builder() {
			this.gameCode = new GameCode();
			this.playerWithTurn = null;
			this.round = 0;
		}

		public Builder setGameCode(String uuid) {
			this.gameCode = GameCode.fromString(uuid);
			return this;
		}

		public Builder setGameCode(GameCode gameCode) {
			this.gameCode = gameCode;
			return this;
		}

		public Builder setRound(int round) {
			this.round = round;
			return this;
		}

		public Builder setDeck(Deck deck) {
			this.deck = deck;
			return this;
		}

		public Builder setPlayerWithTurn(Player player) {
			this.playerWithTurn = player;
			return this;
		}

		public Builder setPlayers(List<Player> players) {
			this.players = players;
			return this;
		}

		public Game build() {
			Objects.requireNonNull(this.gameCode);
			Objects.requireNonNull(this.deck);
			Objects.requireNonNull(this.players);

			if (this.round < 0) {
				throw new IllegalStateException("La ronda no puede ser inferior a 0");
			}

			if (this.playerWithTurn != null && !this.players.contains(this.playerWithTurn)) {
				throw new IllegalStateException("El jugador con turno no se encuentra en la partida");
			}

			return new Game(this);
		}
	}
}
