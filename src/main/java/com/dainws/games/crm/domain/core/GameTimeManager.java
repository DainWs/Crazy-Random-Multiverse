package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.core.player.Player;

public class GameTimeManager implements EventTrigger {

	// This first turn and first round is for classic game
	private static final int FIRST_TURN = 0;
	private static final int FIRST_ROUND = 1;

	private EventPublisher eventPublisher;

	public GameTimeManager() {
		this.eventPublisher = EventPublisher.NONE;
	}
	
	public void resetTurnAndRoundOf(Game game) {
		game.setTurn(FIRST_TURN);
		game.setRound(FIRST_ROUND);
	}

	public void nextTurnOf(Game game) {
		int nextTurn = game.getTurn() + 1;
		int lastTurn = this.getLastTurnOf(game);

		if (nextTurn >= lastTurn) {
			nextTurn = FIRST_TURN;
		}

		if (nextTurn == FIRST_TURN) {
			this.nextRoundOf(game);
		}

		game.setTurn(nextTurn);
		this.notifyTurnChangeOf(game);
	}

	public void prevTurnOf(Game game) {
		int prevTurn = game.getTurn() - 1;
		int lastTurn = this.getLastTurnOf(game);

		if (prevTurn < FIRST_TURN) {
			prevTurn = lastTurn;
		}
		
		if (prevTurn == lastTurn) {
			this.prevRoundOf(game);
		}

		game.setTurn(prevTurn);
		this.notifyTurnChangeOf(game);
	}

	public void nextRoundOf(Game game) {
		int nextRound = game.getRound() + 1;

		game.setRound(nextRound);
		this.notifyRoundChangeOf(game);
	}

	public void prevRoundOf(Game game) {
		int prevRound = game.getRound() - 1;
		if (prevRound < FIRST_ROUND) {
			prevRound = FIRST_ROUND;
		}

		game.setRound(prevRound);
		this.notifyRoundChangeOf(game);
	}

	private int getLastTurnOf(Game game) {
		int alivePlayersCount = 0;
		for (Player player : game.getPlayers()) {
			if (!player.isSpectator()) {
				alivePlayersCount++;
			}
		}

		return alivePlayersCount;
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
