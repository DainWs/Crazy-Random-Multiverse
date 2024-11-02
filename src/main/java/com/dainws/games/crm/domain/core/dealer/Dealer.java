package com.dainws.games.crm.domain.core.dealer;

import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;

public class Dealer {
	private Deck deck;
	private DealStrategyFactory dealStrategyFactory;

	public Dealer(Deck deck) {
		this.deck = deck;
		this.dealStrategyFactory = new RandomDealStrategyFactory();
	}

	public void dealCardsToPlayerWithTurn(Game game) {
		this.dealCardsToPlayer(game, game.getPlayerWithTurn());
	}

	public void dealCardsToPlayer(Game game, Player player) {
		DealStrategy strategy = this.dealStrategyFactory.createStrategy(game.getRoundNumber());
		this.dealCardsToPlayer(game, player, strategy);
	}

	public void dealCardsToPlayer(Game game, Player player, DealStrategy dealStrategy) {
		List<Card> dealedCards = dealStrategy.drawFrom(this.deck);

		for (Card card : dealedCards) {
			this.addCardToPlayerHand(game, player, card);
		}
	}

	private void addCardToPlayerHand(Game game, Player player, Card card) {
		Hand hand = player.getHand();
		hand.addCard(card);

		this.notifyDealedCardToPlayer(game, player, card);
	}

	private void notifyDealedCardToPlayer(Game game, Player player, Card card) {
		EventDetails details = new EventDetails(game);
		details.setTargetPlayer(player);
		details.setTargetCard(card);
		game.publishEvent(EventCode.PLAYER_RECEIVE_CARD, details);
	}

	public void setDealStrategyFactory(DealStrategyFactory classicDealStrategyFactory) {
		this.dealStrategyFactory = classicDealStrategyFactory;
	}
}
