package com.dainws.games.cbg.domain;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import com.dainws.games.cbg.domain.dealer.DealStrategy;
import com.dainws.games.cbg.domain.dealer.DealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.Dealer;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.exception.NoSuchPlayerException;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.PlayerCode;

public class CardBattleGame {
	private int playerIndexWithTurn;
	private int round;

	private Dealer dealer;
	private List<Player> players;
	private DealStrategyFactory dealStrategyFactory;

	private CardBattleGame(Builder builder) {
		this.playerIndexWithTurn = -100;
		this.round = -100;

		this.dealer = new Dealer(builder.deck);
		this.players = builder.players;
		this.dealStrategyFactory = builder.dealStrategyFactory;
	}

	public void start() {
		this.playerIndexWithTurn = 0;
		this.round = 0;
		
		DealStrategy dealStrategy = this.dealStrategyFactory.createStrategy(this.round);
		this.dealer.setStrategy(dealStrategy);
	}

	public void nextTurn() {
		this.playerIndexWithTurn++;

		if (this.playerIndexWithTurn >= this.players.size()) {
			this.playerIndexWithTurn = 0;
			this.nextRound();
		}
	}

	public void dealCardsToPlayerWithTurn() {
		Player playerWithTurn = this.getPlayerWithTurn();
		this.dealer.dealTo(playerWithTurn);
	}

	public Player getPlayerWithTurn() {
		return this.players.get(this.playerIndexWithTurn);
	}

	public void nextRound() {
		this.round++;

		DealStrategy dealStrategy = this.dealStrategyFactory.createStrategy(this.round);
		this.dealer.setStrategy(dealStrategy);
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

	public Player getPlayer(PlayerCode playerCode) throws NoSuchPlayerException {
		Optional<Player> optional = Optional.empty();

		for (Player player : this.players) {
			if (player.getPlayerCode().equals(playerCode)) {
				optional = Optional.of(player);
			}
		}

		if (optional.isEmpty()) {
			new NoSuchPlayerException("No player with " + playerCode + " was found.");
		}

		return optional.get();
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Deck deck;
		private List<Player> players;
		private DealStrategyFactory dealStrategyFactory;

		private Builder() {}

		public Builder withDeck(Deck deck) {
			this.deck = deck;
			return this;
		}

		public Builder withPlayers(List<Player> players) {
			this.players = players;
			return this;
		}

		public Builder withDealStrategyFactory(DealStrategyFactory dealStrategyFactory) {
			this.dealStrategyFactory = dealStrategyFactory;
			return this;
		}

		public CardBattleGame build() {
			Objects.requireNonNull(this.deck);
			Objects.requireNonNull(this.players);
			Objects.requireNonNull(this.dealStrategyFactory);
			return new CardBattleGame(this);
		}
	}
}
