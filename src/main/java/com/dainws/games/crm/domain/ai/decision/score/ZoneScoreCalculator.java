package com.dainws.games.crm.domain.ai.decision.score;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Combatant;

public class ZoneScoreCalculator implements ScoreCalculator<Zone> {

	private static final int CAPACITY_LIMIT = 7;

	private boolean onlyVisibleCombatants;
	private boolean includeLowCapacityPriority;
	private CardScoreCalculator cardScoreCalculator;

	public ZoneScoreCalculator() {
		this.onlyVisibleCombatants = false;
		this.includeLowCapacityPriority = false;
		this.cardScoreCalculator = new CardScoreCalculator();
	}

	public void onlyVisibleCombatants() {
		this.onlyVisibleCombatants = true;
	}

	public void includeLowCapacityPriority() {
		this.includeLowCapacityPriority = true;
	}

	@Override
	public Score calculate(Game game, Zone zone) {
		Score score = new Score();
		if (this.includeLowCapacityPriority) {
			score.increase(this.calculateLowCapacityPriority(zone.getCapacity()));
		}

		if (this.onlyVisibleCombatants) {
			score.increase(this.calculateZoneVisibleCombatantsScore(zone));
		} else {
			score.increase(this.calculateZoneCombatantsScore(zone));
		}

		return score;
	}

	/* The less capacity the area has, the more points it generates. */
	private int calculateLowCapacityPriority(int capacity) {
		if (capacity == CAPACITY_LIMIT) {
			return 0;
		}

		if (capacity > CAPACITY_LIMIT) {
			return CAPACITY_LIMIT - capacity;
		}

		int capacityDiff = CAPACITY_LIMIT - capacity;
		return CAPACITY_LIMIT + capacityDiff;
	}

	private Score calculateZoneCombatantsScore(Zone zone) {
		Score score = new Score();

		Combatant[][] combatantMap = zone.getCombatants();
		for (Combatant[] combatantRow : combatantMap) {
			for (Combatant combatant : combatantRow) {
				if (combatant != null && combatant.isAlive()) {
					score.increase(this.cardScoreCalculator.calculateCombatantScore(combatant));
				}
			}
		}

		return score;
	}

	private Score calculateZoneVisibleCombatantsScore(Zone zone) {
		Score score = new Score();

		Combatant[] combatants = zone.getVisibleCombatants();
		for (Combatant combatant : combatants) {
			if (combatant != null && combatant.isAlive()) {
				score.increase(this.cardScoreCalculator.calculateCombatantScore(combatant));
			}
		}

		return score;
	}

}
