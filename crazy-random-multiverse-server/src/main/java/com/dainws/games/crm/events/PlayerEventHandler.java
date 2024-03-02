package com.dainws.games.crm.events;

import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.cbg.domain.Game;
import com.dainws.games.cbg.domain.PlayerService;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.crm.controller.CommunicationClient;

@Controller
public class PlayerEventHandler {

	private CommunicationClient communicationClient;
	private PlayerService playerService;

	public PlayerEventHandler(CommunicationClient communicationClient, PlayerService playerService) {
		this.communicationClient = communicationClient;
		this.playerService = playerService;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_RECEIVE_CARD")
	public void onPlayerReceiveCard(Event event) throws InterruptedException {
		// TODO extract this to DealerService
		EventDetails details = event.getDetails();
		Player targetPlayer = details.getTargetPlayer();
		this.sendEventToPlayer(event, targetPlayer);

		EventDetails detailsWithoutCard = new EventDetails();
		detailsWithoutCard.setTargetPlayer(targetPlayer);
		Event eventWithoutCard = new Event(EventCode.PLAYER_RECEIVE_CARD, detailsWithoutCard);

		for (Player player : details.getGame().getPlayers()) {
			if (!player.equals(targetPlayer)) {
				this.sendEventToPlayer(eventWithoutCard, player);
			}
		}
	}
	
	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_ATTACK_CARD")
	public void onPlayerAttackCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);
		
		// TODO extract this to PlayerService? Observer pattern needed
		EventDetails eventDetails = event.getDetails();
		this.playerService.updateAlivePlayersOf(eventDetails.getGame());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_PUT_CARD")
	public void onPlayerPutCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_MOVE_CARD")
	public void onPlayerMoveCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_EQUIP_CARD")
	public void onPlayerEquipCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_USE_SPELL")
	public void onPlayerUseSpell(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event); // TODO pending
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.cbg.domain.event.EventCode).PLAYER_DIE")
	public void onPlayerDie(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	private void delayInSeconds(int seconds) throws InterruptedException {
		TimeUnit.SECONDS.sleep(seconds);
	}

	private void sendEventToEveryPlayer(Event event) {
		Game game = event.getDetails().getGame();
		for (Player player : game.getPlayers()) {
			this.sendEventToPlayer(event, player);
		}
	}

	private void sendEventToPlayer(Event event, Player player) {
		this.communicationClient.sendEvent(player, event);
	}
}