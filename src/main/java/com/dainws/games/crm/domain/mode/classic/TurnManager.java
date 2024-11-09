package com.dainws.games.crm.domain.mode.classic;

import com.dainws.games.crm.domain.core.Turn;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;

class TurnManager {

	public void nextTurn(ClassicGame game) {
		Turn nextTurn = this.getNextTurn(game);
		this.changeTurn(game, nextTurn);
	}

	private Turn getNextTurn(ClassicGame game) {
		int turnNumber = game.getTurnNumber();
		int roundNumber = game.getRoundNumber();

		if (game.countAlivePlayers() > 1) {
			return this.getNextTurn(game, turnNumber, roundNumber);
		}

		return game.getTurn();
	}

	private Turn getNextTurn(ClassicGame game, int currentTurn, int currentRound) {
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

	public void prevTurn(ClassicGame game) {
		Turn prevTurn = this.getPrevTurn(game);
		this.changeTurn(game, prevTurn);
	}

	private Turn getPrevTurn(ClassicGame game) {
		int turnNumber = game.getTurnNumber();
		int roundNumber = game.getRoundNumber();

		if (game.countAlivePlayers() > 1) {
			return this.getPrevTurn(game, turnNumber, roundNumber);
		}

		return game.getTurn();
	}

	private Turn getPrevTurn(ClassicGame game, int currentTurn, int currentRound) {
		int prevTurn = currentTurn - 1;
		int prevRound = currentRound;

		if (0 > prevTurn) {
			prevTurn = game.countPlayers();
			prevRound--;
		}

		Player player = game.getPlayers().get(prevTurn);
		if (player.isDeath()) {
			return this.getPrevTurn(game, prevTurn, prevRound);
		}

		return new Turn(prevTurn, prevRound);
	}
	
	private void changeTurn(ClassicGame game, Turn newTurn) {
		Turn oldTurn = game.getTurn();
		if (!oldTurn.isTurnEquals(newTurn)) {
			game.publishEvent(EventCode.TURN_CHANGE);
		}

		if (!oldTurn.isRoundEquals(newTurn)) {
			game.publishEvent(EventCode.ROUND_CHANGE);
		}

		if (!oldTurn.equals(newTurn)) {
			game.setTurn(newTurn);
		}
	}
}