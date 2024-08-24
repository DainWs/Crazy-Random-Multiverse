package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameTimeManager;
import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;

public class EventBasedGameTimeManager extends GameTimeManager implements EventTrigger {

	private EventPublisher eventPublisher;

	public EventBasedGameTimeManager() {
		this.eventPublisher = EventPublisher.NONE;
	}
	
	@Override
	protected void onNextTurn(Game game) {
		this.notifyTurnChangeOf(game);
	}

	@Override
	protected void onPrevTurn(Game game) {
		this.notifyTurnChangeOf(game);
	}

	@Override
	protected void onNextRound(Game game) {
		this.notifyRoundChangeOf(game);
	}

	@Override
	protected void onPrevRound(Game game) {
		this.notifyRoundChangeOf(game);
	}

	private void notifyTurnChangeOf(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);
		details.setTargetPlayer(game.getPlayerWithTurn());

		this.eventPublisher.publish(new Event(EventCode.TURN_CHANGE, details));
	}

	private void notifyRoundChangeOf(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		this.eventPublisher.publish(new Event(EventCode.ROUND_CHANGE, details));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
