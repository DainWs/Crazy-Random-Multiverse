package com.dainws.games.crm.domain.ai.goals;

import com.dainws.games.crm.domain.ai.AIPlayer;
import com.dainws.games.crm.domain.ai.goals.conditions.SpecificActionArchiveCondition;
import com.dainws.games.crm.domain.ai.goals.conditions.TargetPlayerDecorator;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.action.UseSpellAction;
import com.dainws.games.crm.domain.core.player.Player;

public class BaseGoals {
	private BaseGoals() {}
	
	public static Goal createPutAllCards(Player targetPlayer) {
		GoalArchiveCondition archiveCondition = new SpecificActionArchiveCondition(PutAction.class);
		GoalArchiveCondition isTargetPlayer = new TargetPlayerDecorator(archiveCondition, targetPlayer);
		return new InfiniteGoal(BaseGoalNames.PUT_CARD, isTargetPlayer);
	}
	
	public static Goal createAttackWithAllCardsToPlayer(Player targetPlayer) {
		GoalArchiveCondition archiveCondition = new SpecificActionArchiveCondition(AttackAction.class);
		GoalArchiveCondition isTargetPlayer = new TargetPlayerDecorator(archiveCondition, targetPlayer);
		return new InfiniteGoal(BaseGoalNames.ATTACK_PLAYER, isTargetPlayer);
	}
	
	public static Goal createAttackPlayerOneTime(Player targetPlayer) {
		GoalArchiveCondition archiveCondition = new SpecificActionArchiveCondition(AttackAction.class);
		GoalArchiveCondition isTargetPlayer = new TargetPlayerDecorator(archiveCondition, targetPlayer);
		return new OneTimeGoal(BaseGoalNames.ATTACK_PLAYER, isTargetPlayer);
	}
	
	public static Goal createAttackPlayerNTimes(AIPlayer targetPlayer, int times) {
		GoalArchiveCondition archiveCondition = new SpecificActionArchiveCondition(AttackAction.class);
		GoalArchiveCondition isTargetPlayer = new TargetPlayerDecorator(archiveCondition, targetPlayer);
		return new NTimesGoal(BaseGoalNames.ATTACK_PLAYER, isTargetPlayer, times);
	}
}
