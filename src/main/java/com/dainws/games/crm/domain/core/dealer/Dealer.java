package com.dainws.games.crm.domain.core.dealer;

import java.util.List;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.player.Hand;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;

public class Dealer implements EventTrigger {
	private Deck deck;
	private DealStrategyFactory dealStrategyFactory;
	private EventPublisher eventPublisher;

	public Dealer(Deck deck) {
		this.deck = deck;
		this.dealStrategyFactory = new ClassicDealStrategyFactory();
		this.eventPublisher = EventPublisher.NONE;
	}

	public void dealCardsToPlayerWithTurn(Game game) {
		DealStrategy strategy = this.dealStrategyFactory.createStrategy(game.getRound());
		Player player = game.getPlayerWithTurn();

		this.dealCardsToPlayer(game, player, strategy);
	}

	public void dealCardsToPlayer(Game game, Player player, DealStrategy dealStrategy) {
		List<Card> dealedCards = dealStrategy.drawFrom(this.deck);

		Hand playerHand = player.getHand();
		for (Card card : dealedCards) {
			playerHand.addCard(card);
			this.notifyDealedCardToPlayer(game, player, card);
		}
	}

	private void notifyDealedCardToPlayer(Game game, Player player, Card card) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);
		details.setTargetCard(card);
		Event event = new Event(EventCode.PLAYER_RECEIVE_CARD, details);
		this.eventPublisher.publish(event);
	}

	public void setDealStrategyFactory(DealStrategyFactory classicDealStrategyFactory) {
		this.dealStrategyFactory = classicDealStrategyFactory;
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
