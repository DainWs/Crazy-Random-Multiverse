package com.dainws.games.crm.domain.ai.classic;

import java.util.ArrayList;
import java.util.List;

import com.dainws.games.crm.domain.ai.AIAction;
import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.GoalManager;
import com.dainws.games.crm.domain.ai.goals.BaseGoals;
import com.dainws.games.crm.domain.ai.goals.Goal;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public class ClassicGoalManager implements GoalManager {

	private PlayerCode myPlayerCode;
	private List<Goal> goals;
	
	public ClassicGoalManager() {
		this.goals = new ArrayList<>();
	}
	
	public void applySelfAwareness(AIPlayer meAsAPlayer) {
		this.myPlayerCode = meAsAPlayer.getPlayerCode();
	}
	
	@Override
	public void defineGoals(Game game) {
		for (Player player : game.getPlayers()) {
			this.defineGoalsForPlayer(game, player);
		}
	}

	private void defineGoalsForPlayer(Game game, Player player) {
		if (player.isCode(this.myPlayerCode)) {
			this.goals.add(BaseGoals.createPutAllCards(player));
		} else {
			this.goals.addAll(this.decideGoalsFor(game, player));
		}
	}
	
	private List<Goal> decideGoalsFor(Game game, Player player) {
		Board board = game.getBoard();
		Zone zone = board.getZoneOf(player);
		
		boolean onlyHeAndMeArePlaying = (game.getPlayers().size() <= 2);
		if (onlyHeAndMeArePlaying) {
			return List.of(BaseGoals.createAttackWithAllCardsToPlayer(player));
		}

		int capacityOf50percert = zone.getCapacity() / 2;
		if (zone.countCombatants() > capacityOf50percert) {
			return List.of(BaseGoals.createAttackWithAllCardsToPlayer(player));
		}

		if (zone.hasCombatants()) {
			return List.of(BaseGoals.createAttackPlayerOneTime(player));
		}

		return List.of();
	}

	@Override
	public void updateGoalAlignedWith(AIAction action) {
		for (Goal goal : this.goals) {
			goal.updateGoal(action);
		}
	}

	@Override
	public List<Goal> getGoals() {
		return this.goals;
	}

}
