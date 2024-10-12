package com.dainws.games.crm.domain.core.board;

import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.Leader;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;

public class ZoneWithLeader extends Zone {
	private static final int DEFAULT_HORIZONTAL_DIMENSION = 3;
	private static final int DEFAULT_VERTICAL_DIMENSION = 2;
	public static final Coordinate LEADER_COORDINATE = new Coordinate(0, 0);

	public ZoneWithLeader() {
		this(DEFAULT_HORIZONTAL_DIMENSION, DEFAULT_VERTICAL_DIMENSION);
	}

	public ZoneWithLeader(int horizontalDimension, int verticalDimension) {
		super(horizontalDimension, verticalDimension);
	}

	@Override
	protected Combatant[][] createCombatantsMatrix(int horizontalDimension, int verticalDimension) {
		Combatant[][] combatants = new Combatant[verticalDimension + 1][];
		combatants[0] = new Combatant[1];

		for (int rowIndex = 1; rowIndex < combatants.length; rowIndex++) {
			combatants[rowIndex] = new Combatant[horizontalDimension];
		}

		return combatants;
	}

	@Override
	public boolean isAlive() {
		Leader leader = this.getLeader();
		if (leader == NONE) {
			return true;
		}

		return leader.isAlive();
	}

	@Override
	public Health getZoneHealth() {
		Leader leader = this.getLeader();
		if (leader == NONE) {
			return Health.INFINITE;
		}

		Health leaderHealth = leader.getHealth();
		return Health.newInstance(leaderHealth.getValue(), leaderHealth.getMaxValue());
	}

	@Override
	public void putCombatant(Coordinate coordinate, Combatant combatant) throws OperationNotAllowedException {
		if (LEADER_COORDINATE.equals(coordinate) && !combatant.isType(CardType.LEADER)) {
			throw new OperationNotAllowedException("EXCEPTION_COORDINATE_REQUIRES_LEADER");
		}

		super.putCombatant(coordinate, combatant);
	}

	@Override
	public void removeCombatant(Coordinate coordinate) {
		if (!LEADER_COORDINATE.equals(coordinate)) {
			super.removeCombatant(coordinate);
		}
	}

	public Leader getLeader() {
		return (Leader) this.getCombatant(LEADER_COORDINATE);
	}
}