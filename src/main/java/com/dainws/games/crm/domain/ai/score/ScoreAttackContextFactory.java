package com.dainws.games.crm.domain.ai.score;

import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.player.Player;

class ScoreAttackContextFactory extends ActionContextFactory {
	
	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate) {
		List<Player> players = this.getPlayersExceptMe();

		PlayerZoneScoreCalculator calculator = new PlayerZoneScoreCalculator();
		calculator.enableEnemyPriority();
		
		if (players.size() == 1) {
			return players.get(0);
		}

		Player playerWithHighestScore = null;
		Score highestScore = new Score();
		for (Player player : players) {
			Zone playerZone = this.getZoneOf(player);
			Score score = calculator.calculate(playerZone);
			if (score.isBiggerOrEqual(highestScore)) {
				playerWithHighestScore = player;
				highestScore = score;
			}
		}

		return playerWithHighestScore;
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate) {
		if (this.sourceCard == null) {
			this.decideSource();
		}

		return this.sourceCard;
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate) {
		if (this.targetCard == null) {
			this.decideTarget();
		}
		
		return this.targetCard;
	}

	@Override
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate) {
		if (this.sourceCoordinate == null) {
			this.decideSource();
		}

		return this.sourceCoordinate;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate) {
		if (this.targetCoordinate == null) {
			this.decideTarget();
		}
		
		return this.targetCoordinate;
	}

	private void decideSource() {
		Combatant[][] combatants = this.getMyZone().getCombatants();
		for (int rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
			for (int columnIndex = 0; columnIndex < combatants[rowIndex].length; columnIndex++) {
				Combatant combatant = combatants[rowIndex][columnIndex];
				if (combatant != null) {
					this.sourceCard = combatant;
					this.sourceCoordinate = new Coordinate(rowIndex, columnIndex);
				}
			}
		}
	}
	
	private void decideTarget() {
		Zone zone = this.getZoneOf(this.targetPlayer);
		Combatant[][] combatants = zone.getCombatants();
		for (int rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
			for (int columnIndex = 0; columnIndex < combatants[rowIndex].length; columnIndex++) {
				Combatant combatant = combatants[rowIndex][columnIndex];
				if (combatant != null) {
					this.targetCard = combatant;
					this.targetCoordinate = new Coordinate(rowIndex, columnIndex);
				}
			}
		}
	}
}
