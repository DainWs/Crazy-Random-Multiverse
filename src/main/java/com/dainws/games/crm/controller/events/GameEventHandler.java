package com.dainws.games.crm.controller.events;

import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.PartyService;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.dealer.Dealer;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.player.Player;

@Controller
public class GameEventHandler {

	private CommunicationClient communicationClient;
	private PartyService partyService;
	private Dealer dealer;

	public GameEventHandler(CommunicationClient communicationClient, PartyService gameService) {
		this.communicationClient = communicationClient;
		this.partyService = gameService;
		this.dealer = null;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_CREATED")
	public void onGameCreated(Event event) {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_START")
	public void onGameStart(Event event) throws InterruptedException, GameException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);

		// TODO extract this to Dealer? Observer pattern needed
		Game game = event.getDetails().getGame();
		this.dealer.dealCardsToPlayerWithTurn(game);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_END_WITH_WINNER")
	public void onGameEndWithWinner(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);
		
		Game game = event.getDetails().getGame();
		this.partyService.loadPartyFromGame(game.getCode());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).GAME_END_WITH_TIE")
	public void onGameEndWithTie(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(4);
		
		Game game = event.getDetails().getGame();
		this.partyService.loadPartyFromGame(game.getCode());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).TURN_CHANGE")
	public void onTurnChange(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);

		// TODO extract this to Dealer? Observer pattern needed
		EventDetails eventDetails = event.getDetails();
		this.dealer.dealCardsToPlayerWithTurn(eventDetails.getGame());
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
	
	public void setDealer(Dealer dealer) {
		this.dealer = dealer;
	}
}
