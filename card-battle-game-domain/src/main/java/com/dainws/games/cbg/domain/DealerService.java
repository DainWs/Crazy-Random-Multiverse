package com.dainws.games.cbg.domain;

import java.util.List;

import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.dealer.DealStrategy;
import com.dainws.games.cbg.domain.dealer.DealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.ClassicDealStrategyFactory;
import com.dainws.games.cbg.domain.dealer.Deck;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventHandler;
import com.dainws.games.cbg.domain.player.Hand;
import com.dainws.games.cbg.domain.player.Player;

public class DealerService {
	private Deck deck;
	private DealStrategyFactory classicDealStrategyFactory;
	private EventHandler eventHandler;

	public DealerService(Deck deck) {
		this.deck = deck;
		this.classicDealStrategyFactory = new ClassicDealStrategyFactory();
		this.eventHandler = new EventHandler();
	}

	public void dealCardsToPlayerWithTurn(Game game) {
		DealStrategy strategy =  this.classicDealStrategyFactory.createStrategy(game.getRound());
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
		EventDetails detailsWithCard = new EventDetails();
		detailsWithCard.setGame(game);
		detailsWithCard.setTargetPlayer(player);
		detailsWithCard.setTargetCard(card);
		Event eventWithCard = new Event(EventCode.DEALED_CARD_TO_PLAYER, detailsWithCard);
		this.eventHandler.notifyEventToPlayer(player, eventWithCard);

		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);
		Event event = new Event(EventCode.DEALED_CARD_TO_PLAYER, details);

		List<Player> otherPlayers = game.getPlayers();
		otherPlayers.remove(player);
		this.eventHandler.notifyEventToPlayers(otherPlayers, event);
	}
	
	public void setDealStrategyFactory(DealStrategyFactory classicDealStrategyFactory) {
		this.classicDealStrategyFactory = classicDealStrategyFactory;
	}
}
