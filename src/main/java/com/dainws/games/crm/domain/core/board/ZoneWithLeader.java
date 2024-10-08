package com.dainws.games.crm.domain.core.board;

import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.exception.CoordinateNotAllowedException;
import com.dainws.games.crm.domain.exception.EmptyCoordinateException;

public class ZoneWithLeader extends Zone {
	private static final int HORIZONTAL_DIMENSION = 3;
	private static final int VERTICAL_DIMENSION = 2;
	public static final Coordinate LEADER_COORDINATE = new Coordinate(-1, -1);

	private Leader leader;

	public ZoneWithLeader() {
		super(HORIZONTAL_DIMENSION, VERTICAL_DIMENSION);
		this.leader = null;
	}

	@Override
	public boolean isAlive() {
		if (this.leader == null) {
			return true;
		}

		return this.leader.isAlive();
	}

	@Override
	public Health getZoneHealth() {
		if (this.leader == null) {
			return Health.INFINITE;
		}

		Health leaderHealth = this.leader.getHealth();
		return Health.newInstance(leaderHealth.getValue(), leaderHealth.getMaxValue());
	}

	@Override
	public boolean hasCombatant(Coordinate coordinate) {
		if (LEADER_COORDINATE.equals(coordinate)) {
			return this.leader != null;
		}

		return super.hasCombatant(coordinate);
	}

	@Override
	public Combatant getCombatant(Coordinate coordinate) throws EmptyCoordinateException {
		if (LEADER_COORDINATE.equals(coordinate)) {
			return this.leader;
		}

		return super.getCombatant(coordinate);
	}

	@Override
	public void putCombatant(Coordinate coordinate, Combatant combatant) throws CoordinateNotAllowedException {
		if (LEADER_COORDINATE.equals(coordinate)) {
			this.putLeader(combatant);
		} else {
			super.putCombatant(coordinate, combatant);
		}
	}

	private void putLeader(Combatant combatant) throws CoordinateNotAllowedException {
		if (this.leader != null) {
			throw new CoordinateNotAllowedException("EXCEPTION_COORDINATE_NOT_EMPTY");
		}

		if (!combatant.getType().equals(CardType.LEADER)) {
			throw new CoordinateNotAllowedException("EXCEPTION_COORDINATE_REQUIRES_LEADER");
		}

		this.leader = (Leader) combatant;
	}

	@Override
	public void removeCombatant(Coordinate coordinate) {
		if (!LEADER_COORDINATE.equals(coordinate)) {
			super.removeCombatant(coordinate);
		}
	}

	public Leader getLeader() {
		return this.leader;
	}
}