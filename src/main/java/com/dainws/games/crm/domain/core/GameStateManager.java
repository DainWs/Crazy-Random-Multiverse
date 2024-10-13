package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.core.player.Player;

public class GameStateManager implements EventTrigger {
	private EventPublisher eventPublisher;

	public GameStateManager() {
		this.eventPublisher = EventPublisher.NONE;
	}

	public void next(Game game) {
		if (this.isGameInStartState(game)) {
			game.setState(GameState.IN_PROGRESS);
			this.doStartStateProcess(game);
		}

		if (this.isGameInEndState(game)) {
			game.setState(GameState.AFTER_END);
			this.doEndStateProcess(game);
		}
	}

	private boolean isGameInStartState(Game game) {
		return game.inState(GameState.BEFORE_START);
	}

	private void doStartStateProcess(Game game) {
		this.publishGameEvent(EventCode.GAME_START, game);
	}

	private boolean isGameInEndState(Game game) {
		if (!game.inState(GameState.IN_PROGRESS)) {
			return false;
		}

		return game.getAlivePlayers().size() <= 1;
	}

	private void doEndStateProcess(Game game) {
		if (game.getAlivePlayers().size() == 1) {
			this.publishGameEvent(EventCode.GAME_END_WITH_WINNER, game);
		} else {
			this.publishGameEvent(EventCode.GAME_END_WITH_TIE, game);			
		}
	}

	private void publishGameEvent(EventCode eventCode, Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		if (EventCode.GAME_END_WITH_WINNER.equals(eventCode)) {
			details.setTargetPlayer(this.getWinnerIn(game));
		}

		this.eventPublisher.publish(new Event(eventCode, details));
	}

	private Player getWinnerIn(Game game) {
		Player winner = null;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				winner = player;
			}
		}

		return winner;
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
