package com.dainws.games.crm.events;

import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.DealerService;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.exception.GameException;
import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.player.Player;
import com.dainws.games.crm.services.GameService;

@Controller
public class GameEventHandler {

	private CommunicationClient communicationClient;
	private DealerService dealerService;
	private GameService gameService;

	public GameEventHandler(CommunicationClient communicationClient, DealerService dealerService,
			GameService gameService) {
		this.communicationClient = communicationClient;
		this.dealerService = dealerService;
		this.gameService = gameService;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).GAME_CREATED")
	public void onGameCreated(Event event) {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).GAME_START")
	public void onGameStart(Event event) throws InterruptedException, GameException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);

		// TODO extract this to DealerService? Observer pattern needed
		Game game = event.getDetails().getGame();
		this.dealerService.dealCardsToPlayerWithTurn(game);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).GAME_END_WITH_WINNER")
	public void onGameEndWithWinner(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);
		
		Game game = event.getDetails().getGame();
		this.gameService.delete(game.getCode());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).GAME_END_WITH_TIE")
	public void onGameEndWithTie(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);
		
		Game game = event.getDetails().getGame();
		this.gameService.delete(game.getCode());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).TURN_CHANGE")
	public void onTurnChange(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);

		// TODO extract this to DealerService? Observer pattern needed
		EventDetails eventDetails = event.getDetails();
		this.dealerService.dealCardsToPlayerWithTurn(eventDetails.getGame());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.models.event.EventCode).ROUND_CHANGE")
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
