package com.dainws.games.crm.console.services;

import org.springframework.stereotype.Service;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.card.Card;
import com.dainws.games.cbg.domain.dealer.Dealer;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.actions.PutAction;
import com.dainws.games.crm.console.controllers.Console;
import com.dainws.games.crm.console.events.GameStateEventPublisher;

@Service
public class GameStateService {

	private GameStateEventPublisher eventPublisher;

	public GameStateService(Console console) {
		this.eventPublisher = new GameStateEventPublisher(console);
	}

	public void startGame(Game cardBattleGame) {
		// TODO no tiene mucho sentido que el juego sea siempre diferente y el medio de
		// comunicacion no
		this.eventPublisher.onGameStart(cardBattleGame);

		cardBattleGame.resetRoundAndTurn();
		cardBattleGame.updateDealStrategy();
		
		// TODO dealer la primera vez no puede depender de la estrategia
		Dealer dealer = cardBattleGame.getDealer();
		for (Player player : cardBattleGame.getPlayers()) {
			dealer.dealTo(player);
			Card card = player.getHand().getCards().get(0);
			new PutAction(player, card.getCode(), Position.LEADER_POSITION).perform();
		}
		
		cardBattleGame.nextRound();
		Player player = cardBattleGame.getPlayerWithTurn();
		this.eventPublisher.onPlayerGetTurn(player);
	}

}
