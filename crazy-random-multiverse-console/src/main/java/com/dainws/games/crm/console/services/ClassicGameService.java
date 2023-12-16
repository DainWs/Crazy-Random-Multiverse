package com.dainws.games.crm.console.services;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.action.PutAction;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.card.CardType;
import com.dainws.games.cbg.domain.dealer.Dealer;
import com.dainws.games.cbg.domain.dealer.LeaderStrategy;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.crm.console.domain.models.GameMode;
import com.dainws.games.crm.console.events.GameEvent;
import com.dainws.games.crm.console.events.PlayerEvent;

@Service
public class ClassicGameService implements AbstractGameService {

	private ApplicationEventPublisher eventPublisher;

	public ClassicGameService(ApplicationEventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	@Override
	public void startGame(Game game) {
		this.eventPublisher.publishEvent(GameEvent.newStartGameEvent(game));

		game.resetRoundAndTurn();
		game.updateDealStrategy();

		// TODO dealer la primera vez no puede depender de la estrategia
		this.dealLeadersToPlayers(game);
		this.putLeadersOfPlayers(game);
		
		game.nextRound();
		Player player = game.getPlayerWithTurn();
		this.eventPublisher.publishEvent(PlayerEvent.newPlayerGetTurnEvent(player));
	}
	
	private void dealLeadersToPlayers(Game game) {
		Dealer dealer = game.getDealer();
		dealer.setStrategy(new LeaderStrategy());
		
		for (Player player : game.getPlayers()) {
			dealer.dealTo(player);
			this.eventPublisher.publishEvent(PlayerEvent.newPlayerGetCardsEvent(player));
		}
		
		game.updateDealStrategy();
	}
	
	private void putLeadersOfPlayers(Game game) {
		for (Player player : game.getPlayers()) {
			Card firstLeaderCard = player.getHand().getCardsOf(CardType.LEADER).get(0);
			new PutAction(player, firstLeaderCard.getCode(), Position.LEADER_POSITION).perform();
			this.eventPublisher.publishEvent(PlayerEvent.newPlayerGetCardsEvent(player));
		}
	}

	@Override
	public void endGame(Game game) {
		this.eventPublisher.publishEvent(GameEvent.newEndGameEvent(game));
		
	}

	@Override
	public boolean supports(GameMode mode) {
		return GameMode.CLASSIC.equals(mode);
	}
}
