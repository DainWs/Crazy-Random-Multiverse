package com.dainws.games.crm.domain.ai.goals;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;

public class BaseGoalManager extends PlayerBasedGoalManager {

	@Override
	protected List<Goal> defineAggressiveGoalsForPlayer(AIContext context, Player player) {
		if (this.itsMyPlayer(context, player)) {
			return List.of();
		}

		return this.decideGoalsFor(context, player);
	}
	
	private List<Goal> decideGoalsFor(AIContext context, Player player) {
		Zone zone = context.getPlayerZone(player);
		
		boolean onlyHeAndMeArePlaying = (context.getAlivePlayers().size() <= 2);
		if (onlyHeAndMeArePlaying) {
			this.logger.debug("[AI Behavior] Only we two are playing");
			return List.of(BaseGoals.createAttackWithAllCardsToPlayer(player));
		}

		int capacityOf50percert = zone.getCapacity() / 2;
		if (zone.countCombatants() > capacityOf50percert) {
			this.logger.debug("[AI Behavior] I need to attack him with all cards");
			return List.of(BaseGoals.createAttackWithAllCardsToPlayer(player));
		}

		if (zone.hasCombatants()) {
			this.logger.debug("[AI Behavior] I need to attack him only one time");
			return List.of(BaseGoals.createAttackPlayerOneTime(player));
		}

		return List.of();
	}

	@Override
	protected List<Goal> defineNeutralGoalsForPlayer(AIContext context, Player player) {
		List<Goal> goals = new ArrayList<>();

		if (this.itsMyPlayer(context, player)) {
			this.logger.debug("[AI Behavior] I need to put all warriors on my board");
			goals.add(BaseGoals.createPutAllCards(player));
		}

		goals.add(BaseGoals.createUseAllSpellCards(player));
		return goals;
	}

	@Override
	protected List<Goal> defineDefensiveGoalsForPlayer(AIContext context, Player player) {
		return List.of(); // TODO in-progress
	}
}
