package com.dainws.games.crm.events;

import java.util.concurrent.TimeUnit;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStateManager;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;

@Controller
public class PlayerEventHandler {

	private CommunicationClient communicationClient;
	private PlayerStateManager playerStateManager;

	public PlayerEventHandler(CommunicationClient communicationClient, PlayerStateManager playerStateManager) {
		this.communicationClient = communicationClient;
		this.playerStateManager = playerStateManager;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_RECEIVE_CARD")
	public void onPlayerReceiveCard(Event event) throws InterruptedException {
		// TODO extract this to Dealer
		EventDetails details = event.getDetails();
		Player targetPlayer = details.getTargetPlayer();
		this.sendEventToPlayer(event, targetPlayer);

		EventDetails detailsWithoutCard = new EventDetails();
		detailsWithoutCard.setGame(details.getGame());
		detailsWithoutCard.setTargetPlayer(targetPlayer);
		Event eventWithoutCard = new Event(EventCode.PLAYER_RECEIVE_CARD, detailsWithoutCard);

		for (Player player : details.getGame().getPlayers()) {
			if (!player.equals(targetPlayer)) {
				this.sendEventToPlayer(eventWithoutCard, player);
			}
		}
	}
	
	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_ATTACK_CARD")
	public void onPlayerAttackCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
		this.delayInSeconds(2);
		
		// TODO extract this to PlayerStateManager? Observer pattern needed
		EventDetails eventDetails = event.getDetails();
		this.playerStateManager.updateAlivePlayersOf(eventDetails.getGame());
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_PUT_CARD")
	public void onPlayerPutCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_MOVE_CARD")
	public void onPlayerMoveCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_EQUIP_CARD")
	public void onPlayerEquipCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_USE_SPELL")
	public void onPlayerUseSpell(Event event) throws InterruptedException {
		this.sendEventToEveryPlayer(event); // TODO pending
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.event.EventCode).PLAYER_DIE")
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