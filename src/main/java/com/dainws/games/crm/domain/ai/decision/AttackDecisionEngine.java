package com.dainws.games.crm.domain.ai.decision;

import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.Combatant;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.core.player.Player;

public class AttackDecisionEngine extends ContextDecisionEngine {

	private Player targetPlayer;
	private Card sourceCard;
	private Coordinate sourceCoordinate;
	private Card targetCard;
	private Coordinate targetCoordinate;
	
	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal) {
		List<Player> players = this.getPlayersExceptMe();
		if (players.size() == 1) {
			this.targetPlayer = players.get(0); 
			return this.targetPlayer;
		}

		Board board = this.game.getBoard();
		double lowerHealth = Integer.MAX_VALUE;

		for (Player player : players) {
			Zone zone = board.getZoneOf(player);
			Health health = zone.getZoneHealth();
			if (health.getValue() < lowerHealth) {
				this.targetPlayer = player;
				lowerHealth = health.getValue();
			}
		}
		return this.targetPlayer;
	}

	// TODO so stupid ai, increase card decision logic
	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal) {
		if (this.sourceCard == null) {
			this.decideSource();
		}

		return this.sourceCard;
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal) {
		if (this.targetCard == null) {
			this.decideTarget();
		}
		
		return this.targetCard;
	}

	@Override
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		if (this.sourceCoordinate == null) {
			this.decideSource();
		}

		return this.sourceCoordinate;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		if (this.targetCoordinate == null) {
			this.decideTarget();
		}
		
		return this.targetCoordinate;
	}

	private void decideSource() {
		Combatant[][] combatants = this.myZone.getCombatants();
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
		Board board = this.game.getBoard();
		Zone zone = board.getZoneOf(this.targetPlayer);
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
