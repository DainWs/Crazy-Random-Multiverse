package com.dainws.games.crm.domain.core;

import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;

public class TurnManager {
	public static final int FIRST_ROUND = 1;

	public void startRound(Game game, int round) {
		game.setTurn(new Turn(game.getTurnNumber(), round));
		game.publishEvent(EventCode.ROUND_CHANGE);
	}

	public void beginTurn(Game game, Turn turn) {
		game.setTurn(turn);
		game.markTurnStarted();
	}

	public void announceTurn(Game game) {
		game.publishEvent(EventCode.TURN_CHANGE);
	}

	public Turn getNextTurn(Game game) {
		int turnNumber = game.getTurnNumber();
		int roundNumber = game.getRoundNumber();

		if (game.countAlivePlayers() > 1) {
			return this.getNextTurn(game, turnNumber, roundNumber);
		}

		return game.getTurn();
	}

	private Turn getNextTurn(Game game, int currentTurn, int currentRound) {
		int nextTurn = currentTurn + 1;
		int nextRound = currentRound;

		if (nextTurn >= game.countPlayers()) {
			nextTurn = 0;
			nextRound++;
		}

		Player player = game.getPlayers().get(nextTurn);
		if (player.isDeath()) {
			return this.getNextTurn(game, nextTurn, nextRound);
		}

		return new Turn(nextTurn, nextRound);
	}
}
