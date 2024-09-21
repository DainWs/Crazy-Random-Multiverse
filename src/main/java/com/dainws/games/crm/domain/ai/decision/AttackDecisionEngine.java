package com.dainws.games.crm.domain.ai.decision;

import java.util.List;

import com.dainws.games.crm.domain.ai.AIActionTemplate;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.statistics.Health;
import com.dainws.games.crm.domain.core.player.Player;

public class AttackDecisionEngine extends ContextDecisionEngine {

	@Override
	public Player decideTargetPlayer(AIActionTemplate actionTemplate, Goal goal) {
		List<Player> players = this.getPlayersExceptMe();
		if (players.size() == 1) {
			return players.get(0);
		}

		Board board = this.game.getBoard();
		Player playerWithLowerHealth = null;
		double lowerHealth = Integer.MAX_VALUE;

		for (Player player : players) {
			Zone zone = board.getZoneOf(player);
			Health health = zone.getZoneHealth();
			if (health.getValue() < lowerHealth) {
				playerWithLowerHealth = player;
				lowerHealth = health.getValue();
			}
		}
		return playerWithLowerHealth;
	}

	@Override
	public Card decideSourceCard(AIActionTemplate actionTemplate, Goal goal) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Card decideTargetCard(AIActionTemplate actionTemplate, Goal goal) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Coordinate decideSourceCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Coordinate decideTargetCoordinate(AIActionTemplate actionTemplate, Goal goal) {
		// TODO Auto-generated method stub
		return null;
	}

}
