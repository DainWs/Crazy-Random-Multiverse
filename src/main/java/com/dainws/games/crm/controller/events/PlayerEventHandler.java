package com.dainws.games.crm.controller.events;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

@Controller
public class PlayerEventHandler {

	private CommunicationClient communicationClient;

	public PlayerEventHandler(CommunicationClient communicationClient) {
		this.communicationClient = communicationClient;
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_PASS_TURN")
	public void onPlayerPassTurn(Event event) throws InterruptedException {
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_RECEIVE_CARD")
	public void onPlayerReceiveCard(Event event) throws InterruptedException {
		EventDetails details = event.getDetails();
		Player targetPlayer = details.getTargetPlayer();
		this.sendEventToPlayer(event, targetPlayer);

		EventDetails detailsWithoutCard = new EventDetails(details.getGame());
		detailsWithoutCard.setTargetPlayer(targetPlayer);
		Event eventWithoutCard = new Event(EventCode.PLAYER_RECEIVE_CARD, detailsWithoutCard);

		for (Player player : details.getGame().getPlayers()) {
			if (!player.equals(targetPlayer)) {
				this.sendEventToPlayer(eventWithoutCard, player);
			}
		}
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_ATTACK_CARD")
	public void onPlayerAttackCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_PUT_CARD")
	public void onPlayerPutCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_MOVE_CARD")
	public void onPlayerMoveCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_EQUIP_CARD")
	public void onPlayerEquipCard(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_USE_CARD")
	public void onPlayerUseSpell(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	@EventListener(condition = "#event.code == T(com.dainws.games.crm.domain.core.event.EventCode).PLAYER_DIE")
	public void onPlayerDie(Event event) throws InterruptedException {
		this.sendEventToEveryPlayerClient(event);
	}

	private void sendEventToEveryPlayerClient(Event event) {
		Game game = event.getDetails().getGame();
		for (Player player : game.getPlayers()) {
			this.sendEventToPlayer(event, player);
		}
	}

	private void sendEventToPlayer(Event event, Player player) {
		this.communicationClient.sendEvent(player, event);
	}
}