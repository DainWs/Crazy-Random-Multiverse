package com.dainws.games.crm.controller.events;

import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.services.PartyEventService;

public class GameEventHandler {

	private CommunicationClient communicationClient;
	private PartyEventService eventService;

	public GameEventHandler(CommunicationClient communicationClient, PartyEventService eventService) {
		this.communicationClient = communicationClient;
		this.eventService = eventService;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_CREATED")
	public void onGameCreated(Event event) {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_START")
	public void onGameStart(Event event) throws InterruptedException, GameException {
		this.sendEventToEveryPlayer(event);

		Game game = event.getDetails().getGame();
		Dealer dealer = game.getDealer();
		dealer.dealCardsToPlayerWithTurn(game);
		
		Player playerWithTurn = game.getPlayerWithTurn();
		if (playerWithTurn instanceof AIPlayer aiPlayer) {
			aiPlayer.performBehavior(game);
		}
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_END_WITH_WINNER")
	public void onGameEndWithWinner(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);
		
		// TODO Buscar un sitio
		GameCode gameCode = event.getDetails().getGameCode();
		this.eventService.releaseGameParties(gameCode);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_END_WITH_TIE")
	public void onGameEndWithTie(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);

		// TODO Buscar un sitio
		GameCode gameCode = event.getDetails().getGameCode();
		this.eventService.releaseGameParties(gameCode);
	}

	// TODO valio realmente la pena el cambio en vez de agregar mas eventos?
	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).TURN_CHANGE")
	public void onTurnChange(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);

		EventDetails eventDetails = event.getDetails();
		Game game = eventDetails.getGame();
		Dealer dealer = game.getDealer();
		dealer.dealCardsToPlayerWithTurn(game);
		
		Player playerWithTurn = game.getPlayerWithTurn();
		if (playerWithTurn instanceof AIPlayer aiPlayer) {
			aiPlayer.performBehavior(game);
		}
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).ROUND_CHANGE")
	public void onRoundChange(Event event) {
		this.sendEventToEveryPlayer(event);
	}

	private void delayInSeconds(int seconds) throws InterruptedException {
		TimeUnit.SECONDS.sleep(seconds);
	}

	private void sendEventToEveryPlayer(Event event) {
		Game game = event.getDetails().getGame();
		for (Player player : game.getPlayers()) {
			this.communicationClient.sendEvent(player, event);
		}
	}
}
