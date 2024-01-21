package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventDetails;
import com.dainws.games.cbg.domain.event.EventHandler;
import com.dainws.games.cbg.domain.player.Player;

public class RoundService {

	private static final int FIRST_TURN = 0;
	private static final int FIRST_ROUND = 0;

	private EventHandler eventHandler;

	public RoundService() {
		this.eventHandler = new EventHandler();
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

		Event event = new Event(EventCode.TURN_CHANGE, details);
		this.eventHandler.notifyEventToPlayers(game.getPlayers(), event);
	}

	private void notifyRoundChangeOf(Game game) {
		EventDetails details = new EventDetails();
		details.setGame(game);

		Event event = new Event(EventCode.ROUND_CHANGE, details);
		this.eventHandler.notifyEventToPlayers(game.getPlayers(), event);
	}

	public void setEventListener(EventHandler eventHandler) {
		this.eventHandler = eventHandler;
	}
}
