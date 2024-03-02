package com.dainws.games.cbg.domain;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.dealer.DealStrategy;
import com.dainws.games.cbg.domain.dealer.DealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.ClassicDealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.event.ConsoleEventPublisher;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventPublisher;
import com.dainws.games.cbg.domain.event.EventTrigger;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;

public class DealerService implements EventTrigger {
	private Deck deck;
	private DealStrategyFactory dealStrategyFactory;
	private EventPublisher eventPublisher;

	public DealerService(Deck deck) {
		this.deck = deck;
		this.dealStrategyFactory = new ClassicDealStrategyFactory();
		this.eventPublisher = new ConsoleEventPublisher();
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
