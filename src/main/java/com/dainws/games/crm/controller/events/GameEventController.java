package com.dainws.games.crm.controller.events;

import java.util.EnumMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;

import com.dainws.games.crm.controller.CommunicationClient;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;

@Controller
public class GameEventController {

	private CommunicationClient communicationClient;
	private Consumer<Event> defaultConsumer;
	private Map<EventCode, Consumer<Event>> eventCommunicationMethod;

	public GameEventController(CommunicationClient communicationClient) {
		this.communicationClient = communicationClient;
		this.defaultConsumer = this::sendEventToEveryPlayer;
		this.eventCommunicationMethod = new EnumMap<>(EventCode.class);
		this.eventCommunicationMethod.put(EventCode.PLAYER_RECEIVE_CARD, this::onPlayerReceiveCard);
	}

	@EventListener
	public void handleEvent(Event event) {
		this.eventCommunicationMethod
				.getOrDefault(event.getCode(), this.defaultConsumer)
				.accept(event);
	}

	public void onPlayerReceiveCard(Event event) {
		EventDetails details = event.getDetails();
		Player targetPlayer = details.getTargetPlayer();
		this.communicationClient.sendEvent(targetPlayer, event);

		EventDetails detailsWithoutCard = new EventDetails(details.getGame());
		detailsWithoutCard.setTargetPlayer(targetPlayer);
		Event eventWithoutCard = new Event(EventCode.PLAYER_RECEIVE_CARD, detailsWithoutCard);

		for (Player player : details.getGame().getPlayers()) {
			if (!player.equals(targetPlayer)) {
				this.communicationClient.sendEvent(player, eventWithoutCard);
			}
		}
	}

	private void sendEventToEveryPlayer(Event event) {
		Game game = event.getDetails().getGame();
		for (Player player : game.getPlayers()) {
			this.communicationClient.sendEvent(player, event);
		}
	}
}
