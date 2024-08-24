package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameStateManager;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;

public class EventBasedGameStateManager extends GameStateManager implements EventTrigger {
	private EventPublisher eventPublisher;

	public EventBasedGameStateManager() {
		this.eventPublisher = EventPublisher.NONE;
	}
	
	protected void doStartStateProcess(Game game) {
		this.publishGameEvent(EventCode.GAME_START, game);
	}
	
	protected void doEndStateProcess(Game game) {
		int alivePlayersCount = this.getCountOfAlivePlayersIn(game);

		if (alivePlayersCount == 1) {
			this.publishGameEvent(EventCode.GAME_END_WITH_WINNER, game);
		}

		this.publishGameEvent(EventCode.GAME_END_WITH_TIE, game);
	}
	
	private void publishGameEvent(EventCode eventCode, Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		if (EventCode.GAME_END_WITH_WINNER.equals(eventCode)) {
			details.setTargetPlayer(this.getWinnerIn(game));
		}

		this.eventPublisher.publish(new Event(eventCode, details));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

}
