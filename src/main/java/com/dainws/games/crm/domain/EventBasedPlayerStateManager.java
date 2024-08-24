package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerStateManager;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;

public class EventBasedPlayerStateManager extends PlayerStateManager implements EventTrigger {

	private EventPublisher eventPublisher;

	public EventBasedPlayerStateManager() {
		this.eventPublisher = EventPublisher.NONE;
	}

	@Override
	protected void onPlayerDie(Game game, Player player) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(player);

		this.eventPublisher.publish(new Event(EventCode.PLAYER_DIE, details));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
