package com.dainws.games.crm.domain.core;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import com.dainws.games.crm.domain.core.player.Player;

public final class Turn {
	private final int turnNumber;
	private final int roundNumber;

	public Turn(Collection<Player> players) {
		this.turnNumber = (int) (Math.random() * players.size());
		this.roundNumber = 0;
	}

	public Turn(List<Player> players, Player playerWithTurn, int round) {
		this.turnNumber = players.indexOf(playerWithTurn);
		this.roundNumber = round;
	}

	public Turn(int turn, int round) {
		this.turnNumber = turn;
		this.roundNumber = round;
	}

	public Player getPlayerWithTurn(ArrayList<Player> players) {
		return players.get(this.turnNumber);
	}

	public boolean isTurnEquals(Turn other) {
		return this.turnNumber == other.turnNumber;
	}

	public boolean isRoundEquals(Turn other) {
		return this.roundNumber == other.roundNumber;
	}

	public int getTurnNumber() {
		return turnNumber;
	}
	
	public int getRoundNumber() {
		return roundNumber;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj != null && obj instanceof Turn that) {
			return this.isTurnEquals(that) && this.isRoundEquals(that);
		}
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.turnNumber, this.roundNumber);
	}

	@Override
	public String toString() {
		return "Turn[turnNumber=%s,roundNumber=$s]".formatted(this.turnNumber, this.roundNumber);
	}

}
