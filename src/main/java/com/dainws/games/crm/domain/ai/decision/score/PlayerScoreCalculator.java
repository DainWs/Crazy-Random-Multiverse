package com.dainws.games.crm.domain.ai.decision.score;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.core.player.Player;

public class PlayerScoreCalculator implements ScoreCalculator<Player> {

	private boolean enableEnemyPriority;
	
	public PlayerScoreCalculator() {
		this.enableEnemyPriority = false;
	}
	
	public void enableEnemyPriority() {
		this.enableEnemyPriority = true;
	}
	
	@Override
	public Score calculate(Game game, Player player) {
		Score score = new Score();

		if (player == null) {
			score.decrease(Integer.MAX_VALUE);
			return score;
		}

		Board board = game.getBoard();
		Zone zone = board.getZoneOf(player);
		score.increase(this.calculatePlayerZoneScore(game, zone));
		return score;
	}
	
	private Score calculatePlayerZoneScore(Game game, Zone zone) {
		Score score = new Score();
		score.increase(this.calculatePlayerZoneHealthScore(zone));
		
		ZoneScoreCalculator zoneScoreCalculator = new ZoneScoreCalculator();
		if (this.enableEnemyPriority) {
			zoneScoreCalculator.onlyVisibleCombatants();
			zoneScoreCalculator.includeLowCapacityPriority();
		}
		
		score.increase(zoneScoreCalculator.calculate(game, zone));
		return score;
	}
	
	private Score calculatePlayerZoneHealthScore(Zone zone) {
		Score score = new Score();

		Health health = zone.getZoneHealth();
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
