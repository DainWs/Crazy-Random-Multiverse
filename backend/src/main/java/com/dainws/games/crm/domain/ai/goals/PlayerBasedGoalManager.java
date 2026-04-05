package com.dainws.games.crm.domain.ai.goals;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIContext;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class PlayerBasedGoalManager extends AbstractGoalManager {

	@Override
	protected final List<Goal> defineAggressiveGoals(AIContext context) {
		List<Goal> goals = new ArrayList<>();

		for (Player player : context.getAlivePlayers()) {
			goals.addAll(this.defineAggressiveGoalsForPlayer(context, player));
		}

		return goals;
	}
	
	protected abstract List<Goal> defineAggressiveGoalsForPlayer(AIContext context, Player player);

	@Override
	protected final List<Goal> defineNeutralGoals(AIContext context) {
		List<Goal> goals = new ArrayList<>();

		for (Player player : context.getAlivePlayers()) {
			goals.addAll(this.defineNeutralGoalsForPlayer(context, player));
		}

		return goals;
	}
	
	protected abstract List<Goal> defineNeutralGoalsForPlayer(AIContext context, Player player);

	@Override
	protected final List<Goal> defineDefensiveGoals(AIContext context) {
		List<Goal> goals = new ArrayList<>();

		for (Player player : context.getAlivePlayers()) {
			goals.addAll(this.defineDefensiveGoalsForPlayer(context, player));
		}

		return goals;
	}

	protected abstract List<Goal> defineDefensiveGoalsForPlayer(AIContext context, Player player);

	protected final boolean itsMyPlayer(AIContext context, Player player) {
		return context.getMeAsPlayer().equals(player);
	}
}
