package com.dainws.games.crm.domain.ai.score;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public class PlayerZoneScoreCalculator {

	private boolean enableEnemyPriority;

	public PlayerZoneScoreCalculator() {
		this.enableEnemyPriority = false;
	}

	public void enableEnemyPriority() {
		this.enableEnemyPriority = true;
	}

	public Score calculate(Zone playerZone) {
		Score score = new Score();

		if (playerZone == null) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		score.increase(this.calculatePlayerZoneScore(playerZone));
		return score;
	}

	private Score calculatePlayerZoneScore(Zone playerZone) {
		Score score = new Score();
		score.increase(this.calculatePlayerZoneHealthScore(playerZone));

		ZoneScoreCalculator zoneScoreCalculator = new ZoneScoreCalculator();
		if (this.enableEnemyPriority) {
			zoneScoreCalculator.onlyVisibleCombatants();
			zoneScoreCalculator.includeLowCapacityPriority();
		}

		score.increase(zoneScoreCalculator.calculate(playerZone));
		return score;
	}

	private Score calculatePlayerZoneHealthScore(Zone playerZone) {
		Score score = new Score();

		Health health = playerZone.getZoneHealth();
		if (!this.enableEnemyPriority) {
			Double healthValue = health.getValue();
			score.increase(healthValue.intValue());
			return score;
		}

		Double healthMaxValue = health.getMaxValue();
		Double healthValue = health.getValue();

		Double lossHealth = healthMaxValue - healthValue;
		score.increase(lossHealth.intValue());
		return score;
	}

}
